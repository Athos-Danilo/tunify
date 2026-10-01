import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorySyncService } from '../../core/services/history-sync.service';

@Component({
  selector: 'app-top-musicas-mensais',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-musicas-mensais.component.html',
  styleUrls: ['./top-musicas-mensais.component.scss']
})
export class TopMusicasMensaisComponent implements OnInit {
  mesesDisponiveis: any[] = [];
  mesSelecionado: string = '';
  topMusicas: any[] = [];
  carregando: boolean = true;
  erro: string | null = null;
  isMesAtual: boolean = true;
  userEmail: string = '';

  private historySyncService = inject(HistorySyncService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const userInfoStr = localStorage.getItem('tunify_user_info');
      if (userInfoStr) {
        try {
          const userObj = JSON.parse(userInfoStr);
          this.userEmail = userObj.email || '';
        } catch (e) {
          console.error('[TopMusicasMensais] Erro ao ler user info:', e);
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
          this.carregarTopMusicas(this.mesSelecionado);
        } else {
          this.carregando = false;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[TopMusicasMensais] Erro ao carregar meses:', err);
        this.carregando = false;
        this.erro = 'Não foi possível carregar os meses.';
        this.cdr.detectChanges();
      }
    });
  }

  carregarTopMusicas(mesCodigo: string): void {
    this.carregando = true;
    this.erro = null;
    this.cdr.detectChanges();

    this.historySyncService.getTopTracks(this.userEmail, mesCodigo).subscribe({
      next: (res) => {
        this.topMusicas = res.dados || [];
        this.isMesAtual = res.is_atual ?? false;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[TopMusicasMensais] Erro ao carregar top músicas:', err);
        this.carregando = false;
        this.erro = 'Falha ao carregar as músicas do mês.';
        this.cdr.detectChanges();
      }
    });
  }

  onMesChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target && target.value) {
      this.mesSelecionado = target.value;
      this.carregarTopMusicas(this.mesSelecionado);
    }
  }

  formatarTempo(ms: number): string {
    if (!ms || ms <= 0) return '0:00';
    const totalSegundos = Math.floor(ms / 1000);
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    return `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
  }
}
