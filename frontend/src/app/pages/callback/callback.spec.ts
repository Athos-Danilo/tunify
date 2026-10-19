import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { CallbackComponent } from './callback';
import { AuthService } from '../../core/services/auth.service';

describe('Retorno do Spotify', () => {
  afterEach(() => { localStorage.clear(); TestBed.resetTestingModule(); });
  it('salva sessões separadas e retorna ao convite sem deixar tokens na URL', () => {
    const salvarSessao = vi.fn();
    const navigate = vi.fn();
    TestBed.configureTestingModule({ providers: [
      {provide: ActivatedRoute, useValue: {fragment: of('token=spotify&jwt=tunify&nome=Alice&email=alice%40test.com')}},
      {provide: Router, useValue: {navigate}},
      {provide: AuthService, useValue: {salvarSessao, destinoAposLogin: () => ['/sync/convite', 'vibe-abc']}}
    ] });
    const fixture = TestBed.createComponent(CallbackComponent);
    fixture.detectChanges();
    expect(salvarSessao).toHaveBeenCalledWith('tunify', {nome: 'Alice', email: 'alice@test.com', spotify_token: 'spotify'});
    expect(localStorage.getItem('spotify_token')).toBe('spotify');
    expect(navigate).toHaveBeenCalledWith(['/sync/convite', 'vibe-abc'], {replaceUrl: true});
  });
});
