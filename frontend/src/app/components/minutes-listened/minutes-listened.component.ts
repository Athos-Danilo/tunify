import { Component, Input, OnChanges, SimpleChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-minutes-listened',
  standalone: true,
  imports: [DecimalPipe, RouterModule],
  templateUrl: './minutes-listened.component.html',
  styleUrls: ['./minutes-listened.component.scss']
})
export class MinutesListenedComponent implements OnChanges, OnDestroy {
  @Input() totalMinutos: number = 0; // O valor real que vem do banco
  minutosAnimados: number = 0; // O valor que aparece subindo na tela

  private animacaoId: number = 0; // Guardião do motor nativo
  private timeoutId: any; // Controle do atraso do preloader
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
      }
    };

    // Dá a partida no motor nativo
    this.animacaoId = requestAnimationFrame(animar);
  }

  // SEGURO DE VIDA: Desliga o motor se o usuário sair da página no meio da animação
  ngOnDestroy() {
    if (this.animacaoId) {
      cancelAnimationFrame(this.animacaoId);
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}