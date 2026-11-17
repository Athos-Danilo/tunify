import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { EstatisticasComponent } from './estatisticas.component';
import { AuthService } from '../../core/services/auth.service';
import { HistorySyncService } from '../../core/services/history-sync.service';
import { SpotifyService } from '../../core/services/spotify.service';

describe('EstatisticasComponent', () => {
  beforeEach(() => {
    localStorage.setItem('tunify_user_info', JSON.stringify({ email: 'alice@test.com', nome: 'Alice' }));
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    localStorage.clear();
    document.body.classList.remove('tema-claro');
  });

  async function renderRoute(url: string) {
    const authService = { logout: vi.fn() };
    const spotifyService = {
      buscarResumoPerfil: vi.fn().mockReturnValue(of({ dono_da_conta: 'Alice', foto_perfil: null })),
    };
    const historySyncService = {
      getAvailableMonths: vi.fn().mockReturnValue(
        of([{ codigo: '2026-11', label: 'Novembro 2026 (Atual)', is_atual: true }])
      ),
      getTopTracks: vi.fn().mockReturnValue(of({ is_atual: true, dados: [] })),
    };

    TestBed.configureTestingModule({
      imports: [EstatisticasComponent],
      providers: [
        provideRouter([{ path: 'estatisticas', component: EstatisticasComponent }]),
        { provide: AuthService, useValue: authService },
        { provide: SpotifyService, useValue: spotifyService },
        { provide: HistorySyncService, useValue: historySyncService },
      ],
    });

    const router = TestBed.inject(Router);
    await router.navigateByUrl(url);

    const fixture = TestBed.createComponent(EstatisticasComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    return { fixture, component: fixture.componentInstance, historySyncService };
  }

  it('mantém todas as gavetas fechadas por padrão quando não há query param', async () => {
    const { fixture, component } = await renderRoute('/estatisticas');

    expect(component.gavetaHistoricoAberta).toBe(false);
    expect(component.gavetaTopMusicasAberta).toBe(false);
    expect(component.gavetaTopArtistasAberta).toBe(false);
    expect(component.gavetaTopMinutosAberta).toBe(false);
    expect(component.gavetaGraficoDiarioAberta).toBe(false);
    expect(component.gavetaHorarioPicoAberta).toBe(false);
    expect(fixture.nativeElement.querySelector('app-top-musicas-mensais')).toBeNull();
  });

  it('abre automaticamente a bandeja de Top Músicas Mensais quando recebe ?gaveta=top-musicas', async () => {
    const { fixture, component, historySyncService } = await renderRoute('/estatisticas?gaveta=top-musicas');

    expect(component.gavetaTopMusicasAberta).toBe(true);
    expect(component.gavetaHistoricoAberta).toBe(false);
    expect(component.gavetaTopArtistasAberta).toBe(false);

    const gaveta = fixture.nativeElement.querySelector('#gaveta-top-musicas');
    expect(gaveta?.classList.contains('aberta')).toBe(true);
    expect(fixture.nativeElement.querySelector('app-top-musicas-mensais')).not.toBeNull();
    expect(historySyncService.getAvailableMonths).toHaveBeenCalledWith('alice@test.com');
    expect(historySyncService.getTopTracks).toHaveBeenCalledWith('alice@test.com', '2026-11', 'plays');
  });
});
