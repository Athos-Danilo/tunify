import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-card-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-perfil.component.html',
  styleUrls: ['./card-perfil.component.scss'] 
})

export class CardPerfilComponent implements OnInit, OnDestroy {
  @Input() nomeUsuario: string | null = '';
  @Input() dadosDemograficos: any = {};
  @Input() modoEscuro: boolean = true;

  @Input() ultimaMusica: any = null; 
  @Input() minutosOuvidosHoje: number = 0;

  // 🚨 AJUSTE: Duas variáveis independentes e ambas começam falsas!
  exibirSaudacao: boolean = false;
  exibirNome: boolean = false; 
  textoSaudacao: string = '';
  activeSlide: number = 0;
  private carrosselInterval: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // 🚨 PASSO 1: Apenas decide qual é o texto, mas mantém escondido
    this.avaliarSaudacao();

    // 🚨 PASSO 2: O Preloader some (6 segundos) e a animação entra!
    setTimeout(() => {
      
      // O texto "Boa tarde!" desliza pra cima e aparece de forma suave
      this.exibirSaudacao = true;
      this.cdr.detectChanges();

      // 🚨 PASSO 3: Espera 4.5s, esconde a saudação e desliza o Nome pra cima
      setTimeout(() => {
        this.exibirSaudacao = false;
        this.exibirNome = true; 
        this.cdr.detectChanges();

        // 🚨 PASSO 4: Exatamente 4 segundos DEPOIS do nome, roda o carrossel
        setTimeout(() => {
          this.iniciarCarrossel(true); 
        }, 4000);

      }, 4500);

    }, 4900);
  }

  // ... (o restante do arquivo continua igualzinho!)

  ngOnDestroy() {
    if (this.carrosselInterval) {
      clearInterval(this.carrosselInterval);
    }
  }

  private avaliarSaudacao() {
    const horaAtual = new Date().getHours();

    if (horaAtual >= 5 && horaAtual < 12) {
      this.textoSaudacao = 'Bom dia!';
    } else if (horaAtual >= 12 && horaAtual < 18) {
      this.textoSaudacao = 'Boa tarde!';
    } else if (horaAtual >= 18 && horaAtual <= 23) {
      this.textoSaudacao = 'Boa noite!';
    } else {
      this.textoSaudacao = 'Curtindo a Madrugada?';
    }
  }

  private iniciarCarrossel(trocaImediata: boolean = false) {
    // Se for exigido, faz a primeira troca de bloco imediatamente, sem esperar os 7s do intervalo
    if (trocaImediata) {
      this.activeSlide = (this.activeSlide + 1) % 3;
      this.cdr.detectChanges();
    }

    // Mantém o loop infinito a cada 7 segundos
    this.carrosselInterval = setInterval(() => {
      this.activeSlide = (this.activeSlide + 1) % 3;
      this.cdr.detectChanges(); 
    }, 7000);
  }
}