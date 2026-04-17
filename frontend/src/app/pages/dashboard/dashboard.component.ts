import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { SpotifyService } from '../../core/services/spotify.service';
import { DashboardService } from '../../core/services/dashboard.service'; // 1. Importa o novo serviço

import { HeaderComponent } from '../../components/header/header.component';
import { TopMusicasComponent } from '../../components/top-musicas/top-musicas.component';
import { MinutesListenedComponent } from '../../components/minutes-listened/minutes-listened.component'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent, TopMusicasComponent, MinutesListenedComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  nomeUsuario: string | null = '';
  emailUsuario: string | null = '';
  
  // 2. Variável que o nosso Card de Minutos vai "beber"
  minutosTotais: number = 0; 
  
  modoEscuro = true;

  dadosDemograficos: any = {
    carregando: true,
    foto_perfil: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', 
    tipo_conta: 'PREMIUM',
    total_playlists: 0,
    seguidores: 128,
    seguindo: 350
  };

  private router = inject(Router);
  private spotifyService = inject(SpotifyService);
  private dashboardService = inject(DashboardService); // 3. Injeta o serviço de estatísticas
  private cdr = inject(ChangeDetectorRef); 

  ngOnInit() {
    this.nomeUsuario = localStorage.getItem('usuario_nome');
    this.emailUsuario = localStorage.getItem('usuario_email');
    
    // Leão de chácara
    if (!localStorage.getItem('spotify_token') || !this.emailUsuario) {
      this.router.navigate(['/']);
      return; 
    }

    // Chamada 1: Resumo do Perfil (Spotify API)
    this.spotifyService.buscarResumoPerfil(this.emailUsuario).subscribe({
      next: (resumoReal) => {
        this.nomeUsuario = resumoReal.dono_da_conta; 
        this.dadosDemograficos = {
          carregando: false,
          foto_perfil: resumoReal.foto_perfil,
          tipo_conta: resumoReal.tipo_conta,
          total_playlists: resumoReal.total_playlists,
          seguidores: resumoReal.seguidores,
          seguindo: resumoReal.seguindo
        };
        this.cdr.detectChanges(); 
      },
      error: (erro) => {
        console.error('[ERRO] Falha ao buscar perfil:', erro);
        this.dadosDemograficos.carregando = false;
        this.cdr.detectChanges();
      }
    });

    // 4. Chamada 2: Minutos Ouvidos (Nosso Backend / PostgreSQL)
    this.dashboardService.obterMinutosOuvidos(this.emailUsuario).subscribe({
      next: (res) => {
        this.minutosTotais = res.total_minutos;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[ERRO] Falha ao buscar minutos:', err);
      }
    });
  }

  alternarTema() {
    this.modoEscuro = !this.modoEscuro; 
  }

  fazerLogout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}