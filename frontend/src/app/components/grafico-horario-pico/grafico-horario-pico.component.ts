import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorySyncService } from '../../core/services/history-sync.service';

interface PeriodoInfo {
  id: string;
  nome: string;
  icone: string;
  classe: string;
  mensagem: string;
  quantidade: number;
  porcentagem: number;
}

const CONFIG_PERIODOS: Record<string, any> = {
  madrugada: { id: 'madrugada', nome: 'Madrugada', icone: 'nights_stay', classe: 'cor-madrugada', mensagem: 'A noite é uma criança e a playlist também.' },
  manha: { id: 'manha', nome: 'Manhã', icone: 'wb_twilight', classe: 'cor-manha', mensagem: 'Começando o dia com a energia lá no alto!' },
  tarde: { id: 'tarde', nome: 'Tarde', icone: 'wb_sunny', classe: 'cor-tarde', mensagem: 'O som perfeito para embalar o ritmo frenético do dia.' },
  noite: { id: 'noite', nome: 'Noite', icone: 'dark_mode', classe: 'cor-noite', mensagem: 'Música para relaxar ou curtir o fim de expediente.' },
};

@Component({
  selector: 'app-grafico-horario-pico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grafico-horario-pico.component.html',
  styleUrls: ['./grafico-horario-pico.component.scss']
})
export class GraficoHorarioPicoComponent implements OnInit {
  carregando: boolean = true;
  erro: string | null = null;
  userEmail: string = '';

  dados: any = null;
  listaPeriodos: PeriodoInfo[] = [];
  dominanteInfo: any = null;
  totalPlays: number = 0;

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
          console.error('[HorarioPico] Erro ao ler user info:', e);
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
    this.historySyncService.getPeakTime(this.userEmail).subscribe({
      next: (res) => {
        this.dados = res;
        this.totalPlays = res.total_plays || 0;

        if (this.totalPlays > 0 && res.dominante && res.dominante !== 'nenhum') {
          this.dominanteInfo = CONFIG_PERIODOS[res.dominante];

          // Constrói a lista ordenada pela ordem temporal do dia
          const ordem = ['madrugada', 'manha', 'tarde', 'noite'];
          this.listaPeriodos = ordem.map(chave => {
            const qtd = res.periodos[chave] || 0;
            return {
              ...CONFIG_PERIODOS[chave],
              quantidade: qtd,
              porcentagem: (qtd / this.totalPlays) * 100
            };
          });
        }

        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[HorarioPico] Erro ao carregar:', err);
        this.carregando = false;
        this.erro = 'Não foi possível carregar os horários de pico.';
        this.cdr.detectChanges();
      }
    });
  }
}
