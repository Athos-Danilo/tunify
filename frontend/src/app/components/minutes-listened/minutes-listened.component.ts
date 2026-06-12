import { Component, Input, OnChanges, SimpleChanges, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-minutes-listened',
  standalone: true,
  imports: [CommonModule, DecimalPipe, RouterModule],
  templateUrl: './minutes-listened.component.html',
  styleUrls: ['./minutes-listened.component.scss']
})
export class MinutesListenedComponent implements OnChanges, OnDestroy {
  @Input() totalMinutos: number = 0; // O valor real que vem do banco
  @Input() variacao: number = 0; // ✨ [NOVO] A porcentagem do mês passado
  minutosAnimados: number = 0; // O valor que aparece subindo na tela
  mostrarVariacao: boolean = false; // Flag para alternar a tela

  private animacaoId: number = 0; // Guardião do motor nativo
  private timeoutId: any; // Controle do atraso do preloader
  private timerVariacao: any; // Timer da exibição automática
  private isHovered: boolean = false; // Guarda se o mouse está em cima
  private jaFoiAnimado: boolean = false; // Flag para garantir que o atraso seja só na 1ª vez

  // 🚨 Injetamos o "Detetive de Mudanças" do Angular
  constructor(private cdr: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalMinutos']) {
      const valorNovo = changes['totalMinutos'].currentValue;
      const valorAntigo = changes['totalMinutos'].previousValue;

      // Só dá a partida se o número for novo e maior que zero!
      if (valorNovo > 0 && valorNovo !== valorAntigo) {
        if (!this.jaFoiAnimado) {
          this.jaFoiAnimado = true;
          // Atraso de 5.8 segundos para começar milissegundos antes do preloader de 6s sumir
          this.timeoutId = setTimeout(() => {
            this.iniciarContagemNativa();
          }, 4000);
        } else {
          // Se o preloader já passou e os dados atualizarem, anima direto
          this.iniciarContagemNativa();
        }
      }
    }
  }

  iniciarContagemNativa() {
    // 1. FREIO DE MÃO: Se já tem animação rodando, cancela para não encavalar
    if (this.animacaoId) {
      cancelAnimationFrame(this.animacaoId);
    }

    const totalFinal = Number(this.totalMinutos) || 0;
    const duracaoAnimacao = 3500; // 2 segundos, animação linear mais rápida
    const tempoInicio = performance.now(); // Relógio interno do PC em milissegundos

    const animar = (tempoAtual: number) => {
      const tempoDecorrido = tempoAtual - tempoInicio;
      const progresso = Math.min(tempoDecorrido / duracaoAnimacao, 1); // Vai de 0.0 até 1.0 (100%)

      // 2. Movimento Linear: velocidade constante, sem desacelerar no final
      const progressoSuave = progresso;

      // 3. Arredondamos para evitar números quebrados que bugam o HTML
      this.minutosAnimados = Math.round(totalFinal * progressoSuave);

      // 4. Dá a ordem expressa pro Angular atualizar os números na tela
      this.cdr.detectChanges();

      if (progresso < 1) {
        // Se não bateu 100%, pede pro navegador renderizar o próximo quadro (60 FPS)
        this.animacaoId = requestAnimationFrame(animar);
      } else {
        // Quando cravar 100%, garante que o número final seja exato
        this.minutosAnimados = totalFinal;
        this.cdr.detectChanges();

        // 🚨 Dispara a exibição automática da variação!
        this.exibirVariacaoAutomatica();
      }
    };

    // Dá a partida no motor nativo
    this.animacaoId = requestAnimationFrame(animar);
  }

  exibirVariacaoAutomatica() {
    if (this.isHovered) return;

    this.mostrarVariacao = true;
    this.cdr.detectChanges();

    this.timerVariacao = setTimeout(() => {
      if (!this.isHovered) {
        this.mostrarVariacao = false;
        this.cdr.detectChanges();
      }
    }, 4000); // Mostra por 4 segundos
  }

  @HostListener('mouseenter')
  @HostListener('touchstart') // Mobile
  onMouseEnter() {
    this.isHovered = true;
    this.mostrarVariacao = true;
    if (this.timerVariacao) {
      clearTimeout(this.timerVariacao);
    }
  }

  @HostListener('mouseleave')
  @HostListener('touchend') // Mobile
  onMouseLeave() {
    this.isHovered = false;
    this.mostrarVariacao = false;
  }

  // SEGURO DE VIDA: Desliga o motor se o usuário sair da página no meio da animação
  ngOnDestroy() {
    if (this.animacaoId) {
      cancelAnimationFrame(this.animacaoId);
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    if (this.timerVariacao) {
      clearTimeout(this.timerVariacao);
    }
  }
}