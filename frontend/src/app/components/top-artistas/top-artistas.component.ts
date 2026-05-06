import { Component, OnInit, Input, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard.service'; // Ajuste o caminho se precisar
import { forkJoin } from 'rxjs'; // 🚨 IMPORT NOVO AQUI!

export interface ArtistaStatus {
  rank: number;
  nome: string;
  capa_url: string;
  minutos: number;
  status: 'up' | 'down' | 'same' | 'new';
  posicoes_mudadas: number;
}

@Component({
  selector: 'app-top-artistas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-artistas.component.html',
  styleUrls: ['./top-artistas.component.scss']
})
export class TopArtistasComponent implements OnInit {
  
  @Input() email: string = ''; 

  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  topArtistas: ArtistaStatus[] = [];
  mesReferencia: string = '';
  totalArtistasMes: number = 0;
  carregando: boolean = true;

  ngOnInit(): void {
    if (this.email) {
      this.buscarDadosDoComponente();
    }
  }

  buscarDadosDoComponente() {
    this.carregando = true;

    // O forkJoin dispara as duas chamadas juntas e só entra no 'next' quando as duas terminarem!
    forkJoin({
      top: this.dashboardService.obterTopArtistas(this.email),
      minutos: this.dashboardService.obterMinutosOuvidos(this.email)
    }).subscribe({
      next: (res) => {
        // Pega os dados, ou usa um array vazio/zero caso não exista nada no banco ainda
        this.topArtistas = res.top.dados || [];
        this.mesReferencia = res.top.mes_referencia || 'Mês Atual';
        this.totalArtistasMes = res.minutos.total_artistas_ouvidos || 0;
        
        // Desliga o loading independentemente de ter vindo dados ou não!
        this.carregando = false;

        // 3. O PULO DO GATO: Força o Angular a aceitar a mudança síncrona do cache
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao buscar dados do Top Artistas:', err);
        this.carregando = false; // Em caso de erro, também tira o loading
      }
    });
  }
}