import { Component, OnInit, Input, inject, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard.service'; 
import { forkJoin } from 'rxjs'; 

export interface ArtistaStatus {
  rank: number;
  nome: string;
  capa_url: string;
  minutos: number;
  musicas_diferentes: number; 
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

  // Pega a referência da div do carrossel no HTML
  @ViewChild('carrossel') carrosselRef!: ElementRef;

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

    forkJoin({
      top: this.dashboardService.obterTopArtistas(this.email),
      minutos: this.dashboardService.obterMinutosOuvidos(this.email)
    }).subscribe({
      next: (res) => {
        // Pega os dados brutos
        const dadosRaw = res.top.dados || [];
        this.topArtistas = dadosRaw;
        this.mesReferencia = res.top.mes_referencia || 'Mês Atual';
        this.totalArtistasMes = res.minutos.total_artistas_ouvidos || 0;
        
        this.carregando = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Erro ao buscar dados do Top Artistas:', err);
        this.carregando = false;
        this.cdr.detectChanges(); 
      }
    });
  }

  // Função para mover o carrossel com as setinhas!
  rolarCarrossel(direcao: 'esq' | 'dir') {
    if (this.carrosselRef) {
      const scrollAmount = 250; // Quantos pixels ele pula por clique
      const currentScroll = this.carrosselRef.nativeElement.scrollLeft;
      
      this.carrosselRef.nativeElement.scrollTo({
        left: direcao === 'esq' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth' // Animação suave nativa do navegador
      });
    }
  }
}