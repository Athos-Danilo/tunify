import { Component, OnInit, AfterViewInit, inject, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { SpotifyService } from '../../core/services/spotify.service';

declare var FinisherHeader: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  nomeUsuario: string | null = '';
  emailUsuario: string | null = '';
  modoEscuro = true;

  dadosDemograficos: any = {
    carregando: true,
    foto_perfil: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', 
    tipo_conta: 'PREMIUM',
    total_playlists: 0,
    seguidores: 128,
    seguindo: 350
  };

  @ViewChild('headerContainer') headerContainer!: ElementRef;
  private router = inject(Router);
  private spotifyService = inject(SpotifyService);
  private cdr = inject(ChangeDetectorRef); 

  ngOnInit() {
    this.nomeUsuario = localStorage.getItem('usuario_nome');
    this.emailUsuario = localStorage.getItem('usuario_email');
    if (!localStorage.getItem('spotify_token') || !this.emailUsuario) {
      this.router.navigate(['/']);
      return; 
    }
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

  ngAfterViewInit() {
    this.renderizarFundo();
  }

  alternarTema() {
    this.modoEscuro = !this.modoEscuro; 
    this.renderizarFundo();
  }

  renderizarFundo() {
    document.querySelectorAll('canvas#finisher-canvas').forEach(c => c.remove());
    const config = this.modoEscuro ? this.getConfigDark() : this.getConfigLight();
    new FinisherHeader(config);
  }

  fazerLogout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }

  getConfigDark() {
    return {
      "count": 12,
      "size": { "min": 1000, "max": 1500, "pulse": 1 },
      "speed": { "x": { "min": 0.6, "max": 3 }, "y": { "min": 0.6, "max": 3 } },
      "colors": {
        "background": "#0b1120",
        "particles": ["#0b1120", "#151e32", "#1e2e48", "#263c5e", "#22406e"]
      },
      "blending": "lighten",
      "opacity": { "center": 0.6, "edge": 0 },
      "skew": 0,
      "shapes": ["c"]
    };
  }

  getConfigLight() {
    return {
      "count": 12,
      "size": { "min": 1000, "max": 1500, "pulse": 0 },
      "speed": { "x": { "min": 0.3, "max": 2 }, "y": { "min": 0.6, "max": 3 } },
      "colors": {
        "background": "#FFFFFF",
        "particles": ["#FFFFFF", "#EEEEEE", "#CFCFCF", "#7e7d7d", "#656464"]
      },
      "blending": "lighten",
      "opacity": { "center": 0.6, "edge": 0 },
      "skew": 0,
      "shapes": ["c"]
    };
  }
}