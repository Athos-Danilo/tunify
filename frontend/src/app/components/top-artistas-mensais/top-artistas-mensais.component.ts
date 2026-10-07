import { Component, OnInit, inject, ChangeDetectorRef, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorySyncService } from '../../core/services/history-sync.service';

@Component({
  selector: 'app-top-artistas-mensais',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-artistas-mensais.component.html',
  styleUrls: ['./top-artistas-mensais.component.scss']
})
export class TopArtistasMensaisComponent implements OnInit {
  mesesDisponiveis: any[] = [];
  mesSelecionado: string = '';
  topArtistas: any[] = [];
  carregando: boolean = true;
  erro: string | null = null;
  isMesAtual: boolean = true;
  userEmail: string = '';
  totalMinutosMes: number = 0;
  dropdownAberto: boolean = false;

  private historySyncService = inject(HistorySyncService);
  private cdr = inject(ChangeDetectorRef);
  private elementRef = inject(ElementRef);

  @HostListener('document:click', ['$event'])
  onClickFora(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.dropdownAberto = false;
    }
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const userInfoStr = localStorage.getItem('tunify_user_info');
      if (userInfoStr) {
        try {
          const userObj = JSON.parse(userInfoStr);
          this.userEmail = userObj.email || '';
        } catch (e) {
          console.error('[TopArtistasMensais] Erro ao ler user info:', e);
        }
      }
    }

    if (this.userEmail) {
      this.carregarMesesDisponiveis();
    } else {
      this.carregando = false;
      this.erro = 'Usuário não autenticado.';
    }
  }

  carregarMesesDisponiveis(): void {
    this.historySyncService.getAvailableMonths(this.userEmail).subscribe({
      next: (meses) => {
        this.mesesDisponiveis = meses || [];
        if (this.mesesDisponiveis.length > 0) {
          this.mesSelecionado = this.mesesDisponiveis[0].codigo;
          this.carregarTopArtistas(this.mesSelecionado);
        } else {
          this.carregando = false;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[TopArtistasMensais] Erro ao carregar meses:', err);
        this.carregando = false;
        this.erro = 'Não foi possível carregar os meses.';
        this.cdr.detectChanges();
      }
    });
  }

  carregarTopArtistas(mesCodigo: string): void {
    this.carregando = true;
    this.erro = null;
    this.cdr.detectChanges();

    this.historySyncService.getTopArtists(this.userEmail, mesCodigo).subscribe({
      next: (res) => {
        this.topArtistas = res.dados || [];
        this.isMesAtual = res.is_atual ?? false;
        this.totalMinutosMes = this.topArtistas.reduce((acc: number, a: any) => acc + (a.minutos || 0), 0);
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[TopArtistasMensais] Erro ao carregar top artistas:', err);
        this.carregando = false;
        this.erro = 'Falha ao carregar os artistas do mês.';
        this.cdr.detectChanges();
      }
    });
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.dropdownAberto = !this.dropdownAberto;
  }

  selecionarMes(codigo: string, event: Event): void {
    event.stopPropagation();
    this.dropdownAberto = false;
    if (codigo !== this.mesSelecionado) {
      this.mesSelecionado = codigo;
      this.carregarTopArtistas(this.mesSelecionado);
    }
  }

  getLabelMesSelecionado(): string {
    const mesObj = this.mesesDisponiveis.find(m => m.codigo === this.mesSelecionado);
    return mesObj ? mesObj.label : 'Selecionar mês';
  }

  formatarTempo(minutos: number): string {
    if (!minutos || minutos <= 0) return '0h 0m';
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    if (h > 0) {
      return `${h}h ${m}m`;
    }
    return `${m}m`;
  }

  formatarRank(rank: number): string {
    return rank < 10 ? `0${rank}` : `${rank}`;
  }
}
