import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { SpotifyService } from '../../core/services/spotify.service';

import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  nomeUsuario: string | null = '';
  emailUsuario: string | null = '';
  
  // Variável que controla a classe [ngClass]="{'tema-claro': !modoEscuro}" lá no HTML
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
  private cdr = inject(ChangeDetectorRef); 

  ngOnInit() {
    this.nomeUsuario = localStorage.getItem('usuario_nome');
    this.emailUsuario = localStorage.getItem('usuario_email');
    
    // Leão de chácara
    if (!localStorage.getItem('spotify_token') || !this.emailUsuario) {
      this.router.navigate(['/']);
      return; 
    }

    // Busca os dados
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
  }

  // Apenas inverte o booleano. O Angular cuida de trocar as cores via CSS!
  alternarTema() {
    this.modoEscuro = !this.modoEscuro; 
  }

  fazerLogout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}