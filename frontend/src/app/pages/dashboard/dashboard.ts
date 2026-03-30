import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // 🚨 Necessário para usar o @if e o | json no HTML
import { SpotifyService } from '../../core/services/spotify.service'; // 🚨 Importando o Garçom

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <h1>Área VIP do Tunify 🎧</h1>
      <h2>Bem-vindo(a), {{ nomeUsuario }}! ✨</h2>
      
      @if (carregando) {
        <p class="loading-text">Consultando os deuses da música... ⏳</p>
      }

      @if (dadosSpotify) {
        <div class="playlists-section">
          <h3>Suas {{ dadosSpotify.total_encontrado }} Playlists no Radar:</h3>
          
          <div class="grid-playlists">
            @for (playlist of dadosSpotify.suas_playlists; track $index) {
              <div class="playlist-card">
                <h4>{{ playlist.nome }}</h4>
                <a [href]="playlist.link_spotify" target="_blank" class="btn-play">▶ Ouvir no Spotify</a>
              </div>
            }
          </div>
        </div>
      }
      
      <button class="btn-logout" (click)="fazerLogout()">Sair / Logout</button>
    </div>
  `,
  styles: [`
    .dashboard-container { text-align: center; padding: 50px 20px; font-family: sans-serif; color: white; background-color: #121212; min-height: 100vh; }
    h1 { color: #1DB954; margin-bottom: 5px;}
    h2 { font-weight: 300; margin-bottom: 40px; color: #b3b3b3; }
    
    .loading-text { color: #1DB954; font-size: 1.2rem; font-style: italic; }
    
    .playlists-section { max-width: 900px; margin: 0 auto; text-align: left; }
    .playlists-section h3 { border-bottom: 1px solid #282828; padding-bottom: 10px; margin-bottom: 20px; }
    
    /* A Mágica do Grid de Cards */
    .grid-playlists { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
    
    .playlist-card { background: #181818; padding: 20px; border-radius: 8px; transition: all 0.3s ease; border: 1px solid transparent; }
    .playlist-card:hover { background: #282828; border-color: #1DB954; transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.4); }
    .playlist-card h4 { margin: 0 0 15px 0; font-size: 1.1rem; }
    
    .btn-play { display: inline-block; color: #1DB954; text-decoration: none; font-weight: bold; font-size: 0.9rem; transition: color 0.3s ease; }
    .btn-play:hover { color: #1ed760; }

    .btn-logout { margin-top: 50px; padding: 10px 30px; background-color: transparent; color: #b3b3b3; border: 1px solid #b3b3b3; border-radius: 50px; cursor: pointer; transition: 0.3s; }
    .btn-logout:hover { border-color: white; color: white; }
  `]
})
export class DashboardComponent implements OnInit {
  
  nomeUsuario: string | null = '';
  emailUsuario: string | null = ''; // 🚨 Variável nova pro e-mail
  
  carregando = true; // Para mostrar o texto de carregando
  dadosSpotify: any = null; // Onde vamos guardar as playlists que chegarem
  
  private router = inject(Router);
  private spotifyService = inject(SpotifyService); // 🚨 Injetando o Garçom na tela!

  // 🚨 1. Injetamos o Despertador do Angular!
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.nomeUsuario = localStorage.getItem('usuario_nome');
    this.emailUsuario = localStorage.getItem('usuario_email'); // 🚨 Pegando o e-mail do cofre!
    
    if (!localStorage.getItem('spotify_token') || !this.emailUsuario) {
      this.router.navigate(['/']);
      return; // Para a execução aqui se for um intruso
    }

    // 🚨 A MÁGICA ACONTECENDO: Fazendo o pedido pro serviço!
    this.spotifyService.buscarPlaylists(this.emailUsuario).subscribe({
      next: (respostaDoPython) => {
        console.log('[SUCESSO] Dados recebidos:', respostaDoPython);
        this.dadosSpotify = respostaDoPython; // Guarda os dados na variável da tela
        this.carregando = false; // Desliga o texto de carregando

        // 🚨 2. A Mágica: Forçamos o Angular a atualizar a tela imediatamente!
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('[ERRO] Falha ao buscar playlists:', erro);
        this.carregando = false;
        this.cdr.detectChanges(); // Acorda ele no erro também
        alert("Ops! O Back-end não conseguiu buscar suas playlists.");
      }
    });
  }

  fazerLogout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}