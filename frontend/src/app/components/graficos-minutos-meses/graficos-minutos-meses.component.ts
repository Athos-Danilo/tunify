import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorySyncService } from '../../core/services/history-sync.service';

@Component({
  selector: 'app-graficos-minutos-meses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './graficos-minutos-meses.component.html',
  styleUrls: ['./graficos-minutos-meses.component.scss']
})
export class GraficosMinutosMesesComponent implements OnInit {
  dados: any[] = [];
  maxMinutos: number = 1;
  linhasGuia: { valor: number, percent: number }[] = [];
  carregando: boolean = true;
  erro: string | null = null;
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
          console.error('[GraficosMinutos] Erro ao ler user info:', e);
        }
      }
    }

    if (this.userEmail) {
      this.carregarDados();
    } else {
      this.carregando = false;
      this.erro = 'Usuário não autenticado.';
    }
  }

  carregarDados(): void {
    this.historySyncService.getMinutesHistory(this.userEmail).subscribe({
      next: (res) => {
        // A API manda ordenado do mais recente pro mais antigo (Top Down)
        // Para o gráfico de colunas (Esquerda pra Direita), queremos o mais antigo na esquerda.
        this.dados = res.reverse();
        
        if (this.dados.length > 0) {
          this.maxMinutos = Math.max(...this.dados.map(d => d.minutos));
          if (this.maxMinutos === 0) this.maxMinutos = 1; // previne divisão por 0
          
          this.linhasGuia = [
            { valor: this.maxMinutos, percent: 100 },
            { valor: Math.floor(this.maxMinutos * 0.75), percent: 75 },
            { valor: Math.floor(this.maxMinutos * 0.5), percent: 50 },
            { valor: Math.floor(this.maxMinutos * 0.25), percent: 25 },
            { valor: 0, percent: 0 }
          ];
        }
        
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[GraficosMinutos] Erro ao carregar minutos:', err);
        this.carregando = false;
        this.erro = 'Não foi possível carregar o gráfico.';
        this.cdr.detectChanges();
      }
    });
  }

  formatarTempo(minutos: number): string {
    if (!minutos || minutos <= 0) return '0 min';
    return `${minutos} min`;
  }
}
