import { Component, OnInit, inject, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit, HostListener, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SpotifyService } from '../../core/services/spotify.service';
import { DashboardService } from '../../core/services/dashboard.service';

import { HeaderComponent } from '../../components/header/header.component';
import { TopMusicasComponent } from '../../components/top-musicas/top-musicas.component';
import { MinutesListenedComponent } from '../../components/minutes-listened/minutes-listened.component';
import { CardPerfilComponent } from '../../components/card-perfil/card-perfil.component';
import { TopArtistasComponent } from '../../components/top-artistas/top-artistas.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    TopMusicasComponent,
    MinutesListenedComponent,
    CardPerfilComponent,
    TopArtistasComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('radarCanvas', { static: true }) radarCanvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private animationFrameId: number = 0;
  private particles: any[] = [];
  private orbs: any[] = [];
  private mouse = { x: -1000, y: -1000 };
  private zone = inject(NgZone);

  nomeUsuario: string | null = '';
  emailUsuario: string | null = '';

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
  private dashboardService = inject(DashboardService);
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

    // Chamada 2: Minutos Ouvidos (Nosso Backend / PostgreSQL)
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
    this.dashboardService.limparCache();
    this.router.navigate(['/']);
  }

  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      this.ctx = this.radarCanvas.nativeElement.getContext('2d')!;
      this.resizeCanvas();
      this.zone.runOutsideAngular(() => {
        this.animate();
      });
    }
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  @HostListener('window:resize')
  resizeCanvas() {
    if (typeof window === 'undefined') return;
    const canvas = this.radarCanvas.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.initParticles();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
  }

  @HostListener('window:mouseleave')
  onMouseLeave() {
    this.mouse.x = -1000;
    this.mouse.y = -1000;
  }

  initParticles() {
    this.particles = [];
    this.orbs = [];
    const width = window.innerWidth;
    const height = window.innerHeight;

    // --- BOKEH PARTICLES (Cinematic Dust) ---
    const numParticles = Math.floor((width * height) / 12000);

    for (let i = 0; i < numParticles; i++) {
      const z = Math.random();
      this.particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: z,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -0.05 - Math.random() * 0.1,
        radius: (z * 1.5 + 0.5) * (Math.random() > 0.95 ? 2.5 : 1),
        opacity: z * 0.4 + 0.1,
        phase: Math.random() * Math.PI * 2
      });
    }

    // --- AMBIENT GLOW ORBS (Fluid Gradients) ---
    this.orbs = [
      {
        baseX: width * 0.7, baseY: height * 0.3,
        r: Math.max(width, height) * 0.45,
        colorLight: '180, 210, 240', // Azul pastel (parecido com a paleta original)
        colorDark: '0, 123, 255',
        speedX: 0.00015, speedY: 0.0002, phaseX: 0, phaseY: 1
      },
      {
        baseX: width * 0.3, baseY: height * 0.7,
        r: Math.max(width, height) * 0.5,
        colorLight: '180, 230, 200', // Verde pastel sutil (mesmo tom de luz do azul)
        colorDark: '29, 185, 84',
        speedX: 0.0002, speedY: 0.00015, phaseX: 2, phaseY: 3
      },
      {
        baseX: width * 0.5, baseY: height * 0.5,
        r: Math.max(width, height) * 0.6,
        colorLight: '200, 205, 215', // Cinza sutil para balancear
        colorDark: '138, 43, 226',
        speedX: 0.0001, speedY: 0.0001, phaseX: 4, phaseY: 5
      }
    ];
  }

  animate = () => {
    const canvas = this.radarCanvas.nativeElement;
    const width = canvas.width;
    const height = canvas.height;

    this.ctx.clearRect(0, 0, width, height);

    const isLight = !this.modoEscuro;
    const time = Date.now();

    // --- RENDER ORBS (PREMIUM FLUID BACKGROUND) ---
    // Usando multiply no claro para efeito de tinta aquarela realista
    this.ctx.globalCompositeOperation = isLight ? 'multiply' : 'screen';

    const mouseX = this.mouse.x !== -1000 ? this.mouse.x : width / 2;
    const mouseY = this.mouse.y !== -1000 ? this.mouse.y : height / 2;
    const mouseOffsetX = (mouseX - width / 2) * 0.1;
    const mouseOffsetY = (mouseY - height / 2) * 0.1;

    for (const orb of this.orbs) {
      const x = orb.baseX + Math.sin(time * orb.speedX + orb.phaseX) * (width * 0.2) + mouseOffsetX * (orb.r / width);
      const y = orb.baseY + Math.cos(time * orb.speedY + orb.phaseY) * (height * 0.2) + mouseOffsetY * (orb.r / height);

      const grad = this.ctx.createRadialGradient(x, y, 0, x, y, orb.r);
      const color = isLight ? orb.colorLight : orb.colorDark;

      // Opacidade alta (0.8) para as cores pastéis ganharem corpo no modo claro
      const baseOpacity = isLight ? 0.8 : 0.25;
      grad.addColorStop(0, `rgba(${color}, ${baseOpacity})`);
      grad.addColorStop(0.5, `rgba(${color}, ${baseOpacity * 0.6})`);
      grad.addColorStop(1, `rgba(${color}, 0)`);

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(x, y, orb.r, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.globalCompositeOperation = 'source-over';

    // --- RENDER BOKEH PARTICLES (DEPTH & DUST) ---
    const parallaxX = (mouseX - width / 2) * -0.05;
    const parallaxY = (mouseY - height / 2) * -0.05;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.x += p.vx + Math.sin(time * 0.0005 + p.phase) * 0.1;
      p.y += p.vy;

      if (p.x < -100) p.x = width + 100;
      if (p.x > width + 100) p.x = -100;
      if (p.y < -100) p.y = height + 100;
      if (p.y > height + 100) p.y = -100;

      const drawX = p.x + parallaxX * p.z;
      const drawY = p.y + parallaxY * p.z;

      const twinkle = Math.sin(time * 0.0015 + p.phase) * 0.5 + 0.5;
      const currentOpacity = p.opacity * (0.4 + twinkle * 0.6);

      this.ctx.beginPath();
      this.ctx.arc(drawX, drawY, p.radius, 0, Math.PI * 2);

      if (isLight) {
        // Partículas bem vibrantes e com muita opacidade para ganharem vida
        const lightAlpha = Math.min(1, currentOpacity * 1.5 + 0.3);
        this.ctx.fillStyle = `rgba(2, 133, 255, ${lightAlpha})`;
      } else {
        this.ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;

        if (p.radius > 1.5) {
          this.ctx.shadowBlur = p.radius * 3;
          this.ctx.shadowColor = `rgba(255, 255, 255, ${currentOpacity})`;
        } else {
          this.ctx.shadowBlur = 0;
        }
      }
      this.ctx.fill();
    }

    this.ctx.shadowBlur = 0;
    this.animationFrameId = requestAnimationFrame(this.animate);
  }
}