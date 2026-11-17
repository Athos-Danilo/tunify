import { Component, OnInit, inject, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import gsap from 'gsap';
import { HeaderComponent } from '../../components/header/header.component';
import { AuthService } from '../../core/services/auth.service';
import { SpotifyService } from '../../core/services/spotify.service';
import { ReproducoesRecentes } from '../../components/reproducoes-recentes/reproducoes-recentes';
import { TopMusicasMensaisComponent } from '../../components/top-musicas-mensais/top-musicas-mensais.component';
import { TopArtistasMensaisComponent } from '../../components/top-artistas-mensais/top-artistas-mensais.component';
import { GraficosMinutosMesesComponent } from '../../components/graficos-minutos-meses/graficos-minutos-meses.component';
import { GraficoMinutosDiariosComponent } from '../../components/grafico-minutos-diarios/grafico-minutos-diarios.component';
import { GraficoHorarioPicoComponent } from '../../components/grafico-horario-pico/grafico-horario-pico.component';

@Component({
  selector: 'app-estatisticas',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, ReproducoesRecentes, TopMusicasMensaisComponent, TopArtistasMensaisComponent, GraficosMinutosMesesComponent, GraficoMinutosDiariosComponent, GraficoHorarioPicoComponent],
  templateUrl: './estatisticas.component.html',
  styleUrls: ['./estatisticas.component.scss']
})
export class EstatisticasComponent implements OnInit {
  modoEscuro: boolean = true;
  nomeUsuario: string = 'Carregando...';
  fotoPerfil: string = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

  // Controle do estado das Gavetas (Accordions) - Inicia todas FECHADAS
  gavetaHistoricoAberta: boolean = false;
  gavetaTopMusicasAberta: boolean = false;
  gavetaTopArtistasAberta: boolean = false;
  gavetaTopMinutosAberta: boolean = false;
  gavetaGraficoDiarioAberta: boolean = false;
  gavetaHorarioPicoAberta: boolean = false;

  private authService = inject(AuthService);
  private spotifyService = inject(SpotifyService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private scrollRafId: number | null = null;

  private readonly gavetasPorQuery: Record<string, () => void> = {
    'historico': () => { this.gavetaHistoricoAberta = true; },
    'top-musicas': () => { this.gavetaTopMusicasAberta = true; },
    'top-artistas': () => { this.gavetaTopArtistasAberta = true; },
    'imersao': () => { this.gavetaTopMinutosAberta = true; },
    'jornada-diaria': () => { this.gavetaGraficoDiarioAberta = true; },
    'horario-pico': () => { this.gavetaHorarioPicoAberta = true; },
  };

  ngOnInit() {
    // Sincroniza o modo claro/escuro com o restante da aplicação
    if (typeof window !== 'undefined') {
      const temaSalvo = localStorage.getItem('tunify_tema');
      if (temaSalvo === 'claro') {
        this.modoEscuro = false;
        document.body.classList.add('tema-claro');
      } else {
        this.modoEscuro = true;
        document.body.classList.remove('tema-claro');
      }
    }

    this.destroyRef.onDestroy(() => {
      if (this.scrollRafId !== null && typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(this.scrollRafId);
        this.scrollRafId = null;
      }
    });

    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const gaveta = params.get('gaveta');
        if (gaveta && this.gavetasPorQuery[gaveta]) {
          this.gavetasPorQuery[gaveta]();
          this.cdr.markForCheck();
          this.rolarParaGaveta(gaveta);
        }
      });

    this.carregarDadosUsuario();
  }

  private rolarParaGaveta(gaveta: string) {
    if (typeof document === 'undefined' || typeof requestAnimationFrame !== 'function') return;
    if (this.scrollRafId !== null && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(this.scrollRafId);
    }
    this.scrollRafId = requestAnimationFrame(() => {
      this.scrollRafId = null;
      document.getElementById(`gaveta-${gaveta}`)?.scrollIntoView?.({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }

  carregarDadosUsuario() {
    if (typeof window !== 'undefined') {
      const userInfoStr = localStorage.getItem('tunify_user_info');
      const fotoSalva = localStorage.getItem('tunify_foto_perfil'); // 🚨 Tenta pegar a foto salva pelo Dashboard

      if (fotoSalva) {
        this.fotoPerfil = fotoSalva; // Foto carregada na hora!
      }

      if (userInfoStr) {
        try {
          const userObj = JSON.parse(userInfoStr);
          const email = userObj.email;
          
          if (userObj.nome) {
            this.nomeUsuario = userObj.nome;
          }

          if (email) {
            this.spotifyService.buscarResumoPerfil(email).subscribe({
              next: (resumo) => {
                this.nomeUsuario = resumo.dono_da_conta || this.nomeUsuario;
                if (resumo.foto_perfil) {
                  this.fotoPerfil = resumo.foto_perfil;
                  localStorage.setItem('tunify_foto_perfil', resumo.foto_perfil); // Salva/Atualiza
                }
                this.cdr.detectChanges();
              },
              error: (err) => {
                console.error('[ERRO] Falha ao carregar perfil nas estatísticas', err);
                this.cdr.detectChanges();
              }
            });
          }
        } catch (e) {
          console.error('[ERRO] Falha ao ler tunify_user_info:', e);
        }
      }
    }
  }

  alternarTema() {
    this.modoEscuro = !this.modoEscuro;
    if (this.modoEscuro) {
      document.body.classList.remove('tema-claro');
      localStorage.setItem('tunify_tema', 'escuro');
    } else {
      document.body.classList.add('tema-claro');
      localStorage.setItem('tunify_tema', 'claro');
    }
  }

  alternarGavetaHistorico() {
    this.gavetaHistoricoAberta = !this.gavetaHistoricoAberta;
  }

  alternarGavetaTopMusicas() {
    this.gavetaTopMusicasAberta = !this.gavetaTopMusicasAberta;
  }

  alternarGavetaTopArtistas() {
    this.gavetaTopArtistasAberta = !this.gavetaTopArtistasAberta;
  }

  alternarGavetaTopMinutos() {
    this.gavetaTopMinutosAberta = !this.gavetaTopMinutosAberta;
  }

  alternarGavetaGraficoDiario() {
    this.gavetaGraficoDiarioAberta = !this.gavetaGraficoDiarioAberta;
  }

  alternarGavetaHorarioPico() {
    this.gavetaHorarioPicoAberta = !this.gavetaHorarioPicoAberta;
  }

  fazerLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
