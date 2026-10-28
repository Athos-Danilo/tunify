import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { AuthService } from './auth.service';
import { authInterceptor } from './auth.interceptor';
import { SyncService } from './sync.service';
import { environment } from '../../../environments/environment';

const token = (exp: number) => `header.${btoa(JSON.stringify({ sub: 'alice@test.com', exp }))}.signature`;

describe('Sessão e convites', () => {
  let auth: AuthService;
  let http: HttpTestingController;
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    TestBed.configureTestingModule({ providers: [
      provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting()
    ] });
    auth = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => { http.verify(); localStorage.clear(); sessionStorage.clear(); TestBed.resetTestingModule(); });

  it('retorna ao convite uma única vez após login e rejeita destinos externos', () => {
    auth.guardarConvite('vibe-abc123');
    expect(auth.destinoAposLogin()).toEqual(['/sync/convite', 'vibe-abc123']);
    expect(auth.destinoAposLogin()).toEqual(['/dashboard']);
    sessionStorage.setItem('tunify_convite_pendente', 'https://example.com');
    expect(auth.destinoAposLogin()).toEqual(['/dashboard']);
  });

  it('rejeita sessões antigas, malformadas ou expiradas', () => {
    for (const value of ['spotify-access-token', token(1), 'invalid.token.data']) {
      auth.salvarSessao(value, {});
      expect(auth.estaLogado()).toBe(false);
    }
    auth.salvarSessao(token(Date.now() / 1000 + 60), {});
    expect(auth.estaLogado()).toBe(true);
  });

  it('envia o JWT sem usar o e-mail do navegador para criar convites', () => {
    const jwt = token(Date.now() / 1000 + 60);
    auth.salvarSessao(jwt, { email: 'spoofed@test.com' });
    const permissions = {share_minutes: true, share_top_tracks: false, share_top_artists: false, share_peak_time: true};
    TestBed.inject(SyncService).criarConvite(permissions).subscribe();
    const req = http.expectOne(`${environment.apiUrl}/sync/convites`);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${jwt}`);
    expect(req.request.body).toEqual({ permissions });
    req.flush({});
  });

  it('permite inspecionar o convite quando um token antigo ficou salvo', () => {
    auth.salvarSessao('old-spotify-token', {});
    TestBed.inject(SyncService).obterDetalhesConvite('vibe-abc').subscribe();
    const req = http.expectOne(`${environment.apiUrl}/sync/convites/vibe-abc`);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
