import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { TopMusicasComponent } from './top-musicas.component';
import { PlayerService } from '../../core/services/player.service';
import { SpotifyService } from '../../core/services/spotify.service';

@Component({ standalone: true, template: '' })
class DummyEstatisticasComponent {}

describe('TopMusicasComponent', () => {
  beforeEach(() => {
    localStorage.setItem('tunify_user_info', JSON.stringify({ email: 'alice@test.com' }));
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    localStorage.clear();
  });

  function setup() {
    const spotifyService = {
      getTopMensal: vi.fn().mockReturnValue(
        of({
          ultima_atualizacao: null,
          proxima_atualizacao: null,
          dados: [
            {
              rank: 1,
              id: 'track1',
              nome: 'Faixa 1',
              artista: 'Artista 1',
              capa_url: 'https://example.com/1.jpg',
              total_plays: 10,
              tendencia: 'nova',
            },
          ],
        })
      ),
    };
    const playerService = {
      playerState$: new BehaviorSubject<any>(null).asObservable(),
      togglePlay: vi.fn(),
      tocarFila: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [TopMusicasComponent],
      providers: [
        provideRouter([{ path: 'estatisticas', component: DummyEstatisticasComponent }]),
        { provide: SpotifyService, useValue: spotifyService },
        { provide: PlayerService, useValue: playerService },
      ],
    });

    const fixture = TestBed.createComponent(TopMusicasComponent);
    fixture.detectChanges();
    return { fixture, router: TestBed.inject(Router) };
  }

  it('exibe o botão de mais informações apenas com ícone e sem texto visível', () => {
    const { fixture } = setup();
    const btn: HTMLButtonElement | null = fixture.nativeElement.querySelector('.btn-ghost-historico');

    expect(btn).not.toBeNull();
    expect(btn!.textContent?.trim()).toBe('');
    expect(btn!.querySelector('svg.icone-info')).not.toBeNull();
    expect(btn!.getAttribute('aria-label')).toContain('Mais informações');
  });

  it('navega para /estatisticas com a gaveta top-musicas ao clicar no ícone de mais informações', async () => {
    const { fixture, router } = setup();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.btn-ghost-historico');

    btn.click();
    await fixture.whenStable();

    expect(router.url).toBe('/estatisticas?gaveta=top-musicas');
  });
});
