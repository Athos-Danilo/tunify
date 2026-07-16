import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpotifyService } from '../../core/services/spotify.service';

@Component({
  selector: 'app-reproducoes-recentes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reproducoes-recentes.html',
  styleUrl: './reproducoes-recentes.scss',
})
export class ReproducoesRecentes implements OnInit {
  private spotifyService = inject(SpotifyService);

  historico: any[] = [];
  carregando: boolean = true;
  erro: boolean = false;

  ngOnInit() {
    this.carregarHistorico();
  }

  carregarHistorico() {
    this.carregando = true;
    this.erro = false;

    let token = '';
    // Tenta pegar o token do localStorage
    if (typeof window !== 'undefined') {
      const userInfoString = localStorage.getItem('tunify_user_info');
      if (userInfoString) {
        const usuario = JSON.parse(userInfoString);
        token = usuario.spotify_token || localStorage.getItem('spotify_token') || '';
      } else {
        token = localStorage.getItem('spotify_token') || '';
      }
    }

    if (!token) {
      this.erro = true;
      this.carregando = false;
      return;
    }

    // Busca as últimas 20 músicas tocadas
    this.spotifyService.getHistoricoRecente(token, 20).subscribe({
      next: (itens) => {
        // Mapeia os dados da API para um formato mais fácil de usar na tela
        this.historico = itens.map((item: any) => ({
          imagem: item.track.album.images[0]?.url || 'https://via.placeholder.com/64',
          nome: item.track.name,
          artistas: item.track.artists.map((a: any) => a.name).join(', '),
          generos: '-', // Gêneros vazios como solicitado
          album: item.track.album.name,
          tocadaEm: item.played_at,
          duracaoMs: item.track.duration_ms
        }));
        this.carregando = false;
      },
      error: (err) => {
        console.error('[ERRO] Falha ao carregar histórico recente', err);
        this.erro = true;
        this.carregando = false;
      }
    });
  }
}
