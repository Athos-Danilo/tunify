import { Component, OnInit, inject, ChangeDetectorRef, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorySyncService } from '../../core/services/history-sync.service';

@Component({
  selector: 'app-grafico-minutos-diarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grafico-minutos-diarios.component.html',
  styleUrls: ['./grafico-minutos-diarios.component.scss']
})
export class GraficoMinutosDiariosComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  
  dados: any[] = [];
  maxMinutos: number = 1;
  linhasGuia: { valor: number, percent: number }[] = [];
  carregando: boolean = true;
  erro: string | null = null;
  userEmail: string = '';
  precisaRolar: boolean = true; // Flag to scroll to the end once data is loaded

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
          console.error('[GraficoDiario] Erro ao ler user info:', e);
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

  ngAfterViewChecked() {
    if (this.precisaRolar && this.scrollContainer && this.dados.length > 0) {
      // Auto-scroll to the right (Today)
      this.scrollContainer.nativeElement.scrollLeft = this.scrollContainer.nativeElement.scrollWidth;
      this.precisaRolar = false;
    }
  }

  carregarDados(): void {
    this.historySyncService.getDailyMinutes(this.userEmail).subscribe({
      next: (res) => {
        this.dados = res;
        
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
        console.error('[GraficoDiario] Erro ao carregar minutos:', err);
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
