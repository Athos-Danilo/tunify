"""Fluxos sociais isolados: nenhum serviço externo ou banco real é usado."""
import sys
from pathlib import Path
from datetime import datetime, timedelta, timezone
from urllib.parse import urlparse, parse_qs
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import jwt
import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.core.database import Base, get_db
from app.core.security import criar_token_jwt, SECRET_KEY, ALGORITHM
from app.models.user import User
from app.models.sync import SyncInvite, SyncConnection
from app.api.v1.endpoints import sync, auth

PERMS = dict(share_minutes=True, share_top_tracks=False, share_top_artists=True, share_peak_time=False)
BACK = {key: not value for key, value in PERMS.items()}


@pytest.fixture
def lab(monkeypatch):
    monkeypatch.setenv('FRONTEND_URL', 'http://localhost:4200')
    monkeypatch.setattr(auth.settings, 'SPOTIFY_REDIRECT_URI', 'http://127.0.0.1:8000/api/v1/auth/callback')
    engine = create_engine('sqlite://', connect_args={'check_same_thread': False}, poolclass=StaticPool)
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    with Session() as db:
        db.add_all([User(spotify_id=name, email=f'{name}@test.com', access_token='spotify', display_name=name)
                    for name in ('alice', 'bob', 'eve')])
        db.commit()
    def database():
        with Session() as db:
            yield db
    app = FastAPI()
    app.include_router(sync.router, prefix='/sync')
    app.include_router(auth.router, prefix='/api/v1/auth')
    app.dependency_overrides[get_db] = database
    with TestClient(app, base_url='http://127.0.0.1:8000') as client:
        yield client, Session
    engine.dispose()


def headers(name):
    return {'Authorization': f'Bearer {criar_token_jwt({"sub": f"{name}@test.com"})}'}


def invite(client, name='alice'):
    r = client.post('/sync/convites', headers=headers(name), json={'permissions': PERMS})
    assert r.status_code == 200, r.text
    return r.json()['invite_code']


def accept(client, code, name='bob'):
    return client.post(f'/sync/convites/{code}/aceitar', headers=headers(name), json={'permissions': BACK})


def test_authentication_and_identity_spoofing(lab):
    client, Session = lab
    for token in (None, 'spotify-token', criar_token_jwt({'sub': 'missing@test.com'}),
                  jwt.encode({'sub': 'alice@test.com', 'exp': 1}, SECRET_KEY, algorithm=ALGORITHM),
                  jwt.encode({'sub': 'alice@test.com', 'exp': 9999999999}, 'another-key-of-at-least-32-characters', algorithm=ALGORITHM)):
        h = {'Authorization': f'Bearer {token}'} if token else {}
        assert client.get('/sync/conexoes?email=alice@test.com', headers=h).status_code == 401
    r = client.post('/sync/convites?email=bob@test.com', headers=headers('alice'), json={'permissions': PERMS})
    assert r.status_code == 200
    with Session() as db:
        assert db.query(SyncInvite).one().sender.email == 'alice@test.com'
    code = r.json()['invite_code']
    public = client.get(f'/sync/convites/{code}?email_logado=alice@test.com').json()
    assert public['is_owner'] is False
    assert 'email' not in public['sender']
    assert client.get(f'/sync/convites/{code}', headers=headers('alice')).json()['is_owner'] is True
    assert client.get('/sync/convites/meus-ativos?email=alice@test.com', headers=headers('bob')).json() == []
    assert client.delete(f'/sync/convites/{code}?email=alice@test.com', headers=headers('eve')).status_code == 404


@pytest.mark.parametrize('sender,receiver', [('alice', 'bob'), ('bob', 'alice')])
def test_accept_preserves_both_directions_and_single_use(lab, sender, receiver):
    client, _ = lab
    code = invite(client, sender)
    result = accept(client, code, receiver)
    assert result.status_code == 200, result.text
    assert result.json()['minhas_permissoes_para_ele'] == BACK
    assert result.json()['permissoes_dele_para_mim'] == PERMS
    other = client.get('/sync/conexoes', headers=headers(sender)).json()[0]
    assert other['minhas_permissoes_para_ele'] == PERMS
    assert other['permissoes_dele_para_mim'] == BACK
    assert client.get('/sync/convites/meus-ativos', headers=headers(sender)).json() == []
    assert accept(client, code, 'eve').status_code == 400
    assert client.delete(f'/sync/convites/{code}', headers=headers(sender)).status_code == 400
    assert client.get(f'/sync/convites/{code}').json()['status'] == 'ACEITO'
    assert client.get('/sync/conexoes', headers=headers('eve')).json() == []


def test_self_invite_duplicate_revoke_and_expiry(lab):
    client, Session = lab
    code = invite(client)
    assert accept(client, code, 'alice').status_code == 400
    assert accept(client, code).status_code == 200
    another = invite(client)
    assert accept(client, another).status_code == 409
    assert client.delete(f'/sync/convites/{another}', headers=headers('alice')).status_code == 200
    assert client.get(f'/sync/convites/{another}').json()['status'] == 'REVOGADO'
    assert accept(client, another).status_code == 400
    expired = invite(client)
    with Session() as db:
        db.query(SyncInvite).filter_by(invite_code=expired).one().expires_at = datetime.now(timezone.utc) - timedelta(seconds=1)
        db.commit()
    assert accept(client, expired).status_code == 410
    assert client.get(f'/sync/convites/{expired}').json()['status'] == 'EXPIRADO'
    assert accept(client, expired).status_code == 410
    assert client.get('/sync/convites/nonexistent').status_code == 404


@pytest.mark.parametrize('sender,receiver', [('alice', 'bob'), ('bob', 'alice')])
def test_invite_inspection_recognizes_existing_connection_without_consuming_link(lab, sender, receiver):
    client, Session = lab
    used = invite(client, sender)
    cid = accept(client, used, receiver).json()['connection_id']
    new = invite(client, sender)
    for code in (used, new):
        details = client.get(f'/sync/convites/{code}', headers=headers(receiver)).json()
        assert details['is_already_connected'] is True
        assert details['is_owner'] is False
    assert client.get(f'/sync/convites/{new}', headers=headers(sender)).json()['is_already_connected'] is False
    assert client.get(f'/sync/convites/{new}', headers=headers('eve')).json()['is_already_connected'] is False
    assert client.get(f'/sync/convites/{new}?email_logado={receiver}@test.com').json()['is_already_connected'] is False
    with Session() as db:
        assert db.query(SyncInvite).filter_by(invite_code=new).one().status == 'PENDENTE'
        connection = db.query(SyncConnection).filter_by(id=cid).one()
        assert connection.permissions_a_to_b == (PERMS if sender == 'alice' else BACK)
    assert client.delete(f'/sync/conexoes/{cid}', headers=headers(receiver)).status_code == 204
    details = client.get(f'/sync/convites/{new}', headers=headers(receiver)).json()
    assert details['is_already_connected'] is False
    assert details['is_valid'] is True


def test_permissions_disconnect_and_reconnect(lab):
    client, Session = lab
    cid = accept(client, invite(client)).json()['connection_id']
    path = f'/sync/conexoes/{cid}/permissoes'
    assert client.patch(path, headers=headers('eve'), json=BACK).status_code == 404
    assert client.patch(path, headers=headers('alice'), json=BACK).status_code == 200
    bob = client.get('/sync/conexoes', headers=headers('bob')).json()[0]
    assert bob['permissoes_dele_para_mim'] == BACK
    assert bob['minhas_permissoes_para_ele'] == BACK
    assert client.delete(f'/sync/conexoes/{cid}', headers=headers('eve')).status_code == 404
    assert client.delete(f'/sync/conexoes/{cid}', headers=headers('bob')).status_code == 204
    assert client.get('/sync/conexoes', headers=headers('alice')).json() == []
    assert client.patch(path, headers=headers('alice'), json=PERMS).status_code == 404
    assert accept(client, invite(client)).json()['connection_id'] == cid
    with Session() as db:
        assert db.query(SyncConnection).count() == 1


@pytest.mark.parametrize('editor,expected_theirs', [('alice', BACK), ('bob', PERMS)])
def test_editing_never_changes_the_other_persons_permissions(lab, editor, expected_theirs):
    client, _ = lab
    cid = accept(client, invite(client)).json()['connection_id']
    none = {key: False for key in PERMS}
    result = client.patch(f'/sync/conexoes/{cid}/permissoes', headers=headers(editor), json=none)
    assert result.json()['minhas_permissoes_para_ele'] == none
    assert result.json()['permissoes_dele_para_mim'] == expected_theirs


def test_rejects_acceptance_without_explicit_permissions(lab):
    client, _ = lab
    code = invite(client)
    assert client.post(f'/sync/convites/{code}/aceitar', headers=headers('bob'), json={}).status_code == 422
    assert client.get(f'/sync/convites/{code}').json()['status'] == 'PENDENTE'


def test_explicit_strict_permissions_and_environment_url(lab, monkeypatch):
    client, _ = lab
    for payload in ({}, {'permissions': {}}, {'permissions': {**PERMS, 'share_minutes': 'true'}},
                    {'permissions': {**PERMS, 'unexpected': True}}):
        assert client.post('/sync/convites', headers=headers('alice'), json=payload).status_code == 422
    monkeypatch.setenv('FRONTEND_URL', 'https://tunify-pearl.vercel.app/')
    r = client.post('/sync/convites', headers=headers('alice'), json={'permissions': PERMS})
    assert r.json()['invite_url'].startswith('https://tunify-pearl.vercel.app/sync/convite/')


def oauth_state(client):
    r = client.get('/api/v1/auth/login', follow_redirects=False)
    assert 'HttpOnly' in r.headers['set-cookie']
    return parse_qs(urlparse(r.headers['location']).query)['state'][0]


def test_local_login_canonicalizes_host_before_creating_state_cookie(lab):
    client, _ = lab
    r = client.get('http://localhost:8000/api/v1/auth/login', follow_redirects=False)
    assert r.status_code == 307
    assert r.headers['location'] == 'http://127.0.0.1:8000/api/v1/auth/login'
    assert 'set-cookie' not in r.headers
    login = client.get(r.headers['location'], follow_redirects=False)
    assert urlparse(login.headers['location']).hostname == 'accounts.spotify.com'
    state = parse_qs(urlparse(login.headers['location']).query)['state'][0]
    # Retorno no host configurado recebe o cookie e passa na validação.
    cancelled = client.get(f'/api/v1/auth/callback?error=access_denied&state={state}', follow_redirects=False)
    assert cancelled.status_code == 302
    assert cancelled.headers['location'] == 'http://localhost:4200/login?erro=cancelado'


def test_oauth_state_validation_and_separate_session(lab):
    client, _ = lab
    with patch.object(auth.requests, 'post') as post, patch.object(auth.requests, 'get') as get:
        assert client.get('/api/v1/auth/callback?code=code').status_code == 400
        state = oauth_state(client)
        assert client.get('/api/v1/auth/callback?code=code&state=wrong').status_code == 400
        post.assert_not_called()
        post.return_value.json.return_value = {'access_token': 'spotify', 'refresh_token': 'refresh'}
        get.return_value.status_code = 200
        get.return_value.json.return_value = {'id': 'alice', 'email': 'alice@test.com', 'display_name': 'Alice'}
        r = client.get(f'/api/v1/auth/callback?code=code&state={state}', follow_redirects=False)
        assert r.status_code == 302
        url = urlparse(r.headers['location'])
        assert url.query == ''
        values = parse_qs(url.fragment)
        assert values['token'] == ['spotify']
        session = values['jwt'][0]
        me = client.get('/api/v1/auth/me', headers={'Authorization': f'Bearer {session}'})
        assert me.json()['email'] == 'alice@test.com'
        assert 'tunify_oauth_state' not in client.cookies
        assert client.get(f'/api/v1/auth/callback?code=code&state={state}').status_code == 400


def test_cancelled_oauth_returns_to_login_and_clears_state(lab):
    client, _ = lab
    state = oauth_state(client)
    r = client.get(f'/api/v1/auth/callback?error=access_denied&state={state}', follow_redirects=False)
    assert r.status_code == 302
    assert r.headers['location'] == 'http://localhost:4200/login?erro=cancelado'
    assert 'tunify_oauth_state' not in client.cookies


def test_local_password_cannot_be_taken_over_and_local_login_works(lab):
    client, _ = lab
    payload = {'email': 'alice@test.com', 'nova_senha': 'safe-password'}
    assert client.post('/api/v1/auth/local/cadastrar-senha', json=payload).status_code == 401
    assert client.post('/api/v1/auth/local/cadastrar-senha', headers=headers('bob'), json=payload).status_code == 403
    assert client.post('/api/v1/auth/local/cadastrar-senha', headers=headers('alice'), json=payload).status_code == 200
    r = client.post('/api/v1/auth/local/login', json={'email': 'alice@test.com', 'senha': 'safe-password'})
    assert r.status_code == 200
    h = {'Authorization': f'Bearer {r.json()["access_token"]}'}
    assert client.get('/api/v1/auth/me', headers=h).json()['email'] == 'alice@test.com'
