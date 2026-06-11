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

  // INPUTS: Dados recebidos do componente pai:
  @Input() nomeUsuario: string | null = '';
  @Input() dadosDemograficos: any = {};
  @Input() modoEscuro: boolean = true;
  @Input() ultimaMusica: any = null; 
  @Input() minutosOuvidosHoje: number = 0;


  // Variáveis de controle da animação:
  exibirSaudacao: boolean = false;
  exibirNome: boolean = false; 
  
  // Armazena o texto da saudação baseado na hora do dia.
  textoSaudacao: string = '';
  
  // Índice do slide atual do carrossel (0, 1 ou 2).
  activeSlide: number = 0;
  
  // ID do intervalo do carrossel para poder fazer limpeza no ngOnDestroy.
  private carrosselInterval: any;

  constructor(private cdr: ChangeDetectorRef) {}

  /**
   * Fluxo de Inicialização e Animação:
   * Este método controla toda a sequência de timing das animações que aparecem após o carregamento do componente. 
   * 
   * Cronograma Detalhado:
   * 0ms        → Componente inicializa (Preloader ainda visível);
   * 4900ms     → Preloader some e "saudação" (Bom dia/tarde/noite) desliza pra cima;
   * 9400ms     → Saudação desaparece e o nome do usuário desliza pra cima;
   * 13400ms    → O carrossel começa a exibir os blocos.
   */

  ngOnInit() {
    // Passo 1: Descobre qual é o texto da saudação baseado no horarío, mas mantem escondido enquanto o preloader está visível.
    this.avaliarSaudacao();

    // Passo 2: Aguarda 4.9 segundos até o preloader desaparecer depois mostra a saudação deslizando suavemente.
    setTimeout(() => {
      this.exibirSaudacao = true;
      this.cdr.detectChanges();

      // Passo 3: Aguarda 4.5 segundos com a saudação visível depois esconde a saudação e mostra o nome do usuário.
      setTimeout(() => {
        this.exibirSaudacao = false;
        this.exibirNome = true; 
        this.cdr.detectChanges();

        // Passo 4: Aguarda 4 segundos com o nome visível depois inicia o carrossel de blocos (última música, minutos, etc)
        setTimeout(() => {
          this.iniciarCarrossel(true); 
        }, 4000);

      }, 4500);

    }, 4900);
  }

  // Limpeza: Quando o componente é destruído, cancelamos o intervalo do carrossel para evitar memory leaks e comportamentos indesejados.
  ngOnDestroy() {
    if (this.carrosselInterval) {
      clearInterval(this.carrosselInterval);
    }
  }

  /**
   * Define o texto de saudação apropriado baseado na hora do dia:
   * - 5h às 12h  → "Bom dia!"
   * - 12h às 18h → "Boa tarde!"
   * - 18h às 23h → "Boa noite!"
   * - 0h às 5h   → "Curtindo a Madrugada?"
   */
  private avaliarSaudacao() {
    const horaAtual = new Date().getHours();

    if (horaAtual >= 5 && horaAtual < 12) {
      this.textoSaudacao = 'Bom Dia!';
    } else if (horaAtual >= 12 && horaAtual < 18) {
      this.textoSaudacao = 'Boa Tarde!';
    } else if (horaAtual >= 18 && horaAtual <= 23) {
      this.textoSaudacao = 'Boa Noite!';
    } else {
      this.textoSaudacao = 'Curtindo a Madrugada?';
    }
  }

  // Inicialização do Carrossel: Este método configura o loop de rotação automática dos slides.
  private iniciarCarrossel(trocaImediata: boolean = false) {
    if (trocaImediata) {
      this.activeSlide = (this.activeSlide + 1) % 3;
      this.cdr.detectChanges();
    }

    // Configura o loop infinito: a cada 7 segundos, avança para o próximo slide.
    this.carrosselInterval = setInterval(() => {
      this.activeSlide = (this.activeSlide + 1) % 3;
      this.cdr.detectChanges(); 
    }, 7000);
  }
}