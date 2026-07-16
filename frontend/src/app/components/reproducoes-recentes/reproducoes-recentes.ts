import { Component, OnInit, OnDestroy, HostListener, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorySyncService } from '../../core/services/history-sync.service';
import { SecureStorage } from '../../core/utils/secure-storage';

@Component({
  selector: 'app-reproducoes-recentes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reproducoes-recentes.html',
  styleUrls: ['./reproducoes-recentes.scss'],
})
export class ReproducoesRecentes implements OnInit, OnDestroy {
  private historySyncService = inject(HistorySyncService);
  private cdr = inject(ChangeDetectorRef);

  historicoCompleto: any[] = []; // O array completo salvo em memória
  historicoPagina: any[] = []; // O array fatiado para a página atual

  carregando: boolean = true;
  erro: boolean = false;
  email: string = '';
  token: string = '';

  // Paginação Adaptativa
  paginaAtual: number = 1;
  itensPorPagina: number = 50;
  totalPaginas: number = 1;

  // Timer Cooldown
  tempoRestanteSegundos: number = 300; // 5 minutos
  podeAtualizar: boolean = false;
  private intervalTimer: any;

  ngOnInit() {
    this.recuperarCredenciais();
    this.atualizarLimitePorTela();
    
    // Tenta recuperar a página salva do cache (se tiver)
    const paginaSalva = SecureStorage.getItem<number>('tunify_history_page');
    if (paginaSalva) {
      this.paginaAtual = paginaSalva;
    }

    this.carregarHistorico();
  }

  ngOnDestroy() {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.atualizarLimitePorTela();
    this.aplicarPaginacao();
  }

  atualizarLimitePorTela() {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 768) {
        this.itensPorPagina = 30; // Mobile
      } else if (width < 1024) {
        this.itensPorPagina = 40; // Tablet
      } else {
        this.itensPorPagina = 50; // Desktop
      }
    }
  }

  recuperarCredenciais() {
    if (typeof window !== 'undefined') {
      const userInfoString = localStorage.getItem('tunify_user_info');
      if (userInfoString) {
        const usuario = JSON.parse(userInfoString);
        this.email = usuario.email;
        this.token = usuario.spotify_token || localStorage.getItem('spotify_token') || '';
      }
    }
  }

  carregarHistorico(forcarAtualizacao: boolean = false) {
    if (!this.email || !this.token) {
      this.erro = true;
      this.carregando = false;
      return;
    }

    this.carregando = true;
    this.erro = false;

    if (forcarAtualizacao) {
      this.historySyncService.clearCache();
    }

    this.historySyncService.getMergedHistory(this.email, this.token).subscribe({
      next: (dados) => {
        this.historicoCompleto = dados;
        this.carregando = false;
        
        // Verifica quanto tempo falta para poder atualizar de novo (pelo timestamp do cache)
        this.iniciarTimer();
        this.aplicarPaginacao();
      },
      error: (err) => {
        console.error('[ReproducoesRecentes] Erro fatal', err);
        this.erro = true;
        this.carregando = false;
      }
    });
  }

  aplicarPaginacao() {
    if (this.historicoCompleto.length === 0) return;

    this.totalPaginas = Math.ceil(this.historicoCompleto.length / this.itensPorPagina);
    
    if (this.paginaAtual > this.totalPaginas) {
      this.paginaAtual = this.totalPaginas;
    }

    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.historicoPagina = this.historicoCompleto.slice(inicio, fim);

    // Salva a página atual no cache seguro
    SecureStorage.setItem('tunify_history_page', this.paginaAtual);
  }

  mudarPagina(novaPagina: number) {
    if (novaPagina >= 1 && novaPagina <= this.totalPaginas) {
      this.paginaAtual = novaPagina;
      this.aplicarPaginacao();
    }
  }

  irParaPagina(event: any) {
    const valor = parseInt(event.target.value, 10);
    if (!isNaN(valor)) {
      this.mudarPagina(valor);
    } else {
      // Se apagar tudo ou digitar texto, volta o valor atual no input
      event.target.value = this.paginaAtual;
    }
  }

  iniciarTimer() {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
    }
    
    // Pega o timestamp de quando o cache foi criado
    const cachedData = SecureStorage.getItem<{ timestamp: number }>('tunify_history_cache');
    
    if (cachedData) {
      const expiracao = cachedData.timestamp + (5 * 60 * 1000); // 5 minutos depois
      
      this.intervalTimer = setInterval(() => {
        const agora = new Date().getTime();
        const diff = expiracao - agora;
        
        if (diff <= 0) {
          this.tempoRestanteSegundos = 0;
          this.podeAtualizar = true;
          clearInterval(this.intervalTimer);
        } else {
          this.tempoRestanteSegundos = Math.floor(diff / 1000);
          this.podeAtualizar = false;
        }
        
        this.cdr.detectChanges(); // Força a atualização da view no Angular
      }, 1000);
    } else {
      // Fallback
      this.podeAtualizar = true;
    }
  }

  get tempoFormatado(): string {
    const min = Math.floor(this.tempoRestanteSegundos / 60);
    const sec = this.tempoRestanteSegundos % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }

  atualizarManual() {
    if (this.podeAtualizar) {
      this.carregarHistorico(true);
    }
  }
}
