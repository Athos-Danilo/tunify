import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-card-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-perfil.component.html',
  styleUrls: ['./card-perfil.component.scss'] 
})

export class CardPerfilComponent implements OnInit, OnDestroy, OnChanges {

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

  // Flag para controle se o carrossel já foi iniciado no fluxo inicial
  private carrosselIniciado: boolean = false;

  // Controle de pausa via hover do mouse
  private isHovered: boolean = false;

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

  ngOnChanges(changes: SimpleChanges) {
    // Só atualizamos dinamicamente se o fluxo de inicialização já chegou na etapa do carrossel
    if (!this.carrosselIniciado) return;

    const slides = this.availableSlides;

    // Se passamos a ter mais de 1 slide e o carrossel estava parado, nós o reiniciamos
    if (!this.carrosselInterval && slides.length > 1) {
      this.iniciarCarrossel();
    }

    // Se o slide ativo atual não está mais na lista de permitidos, voltamos para o primeiro
    if (!slides.includes(this.activeSlide)) {
      this.activeSlide = slides[0];
      this.cdr.detectChanges();
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

  // Retorna os índices dos slides que devem ser exibidos com base nos dados
  private get availableSlides(): number[] {
    const slides = [0]; // Slide 0 (Demográficos) sempre aparece
    
    if (this.ultimaMusica) {
      slides.push(1); // Slide 1 (Música tocando/última)
    }
    
    if (this.minutosOuvidosHoje > 0) {
      slides.push(2); // Slide 2 (Minutos ouvidos)
    }
    
    return slides;
  }

  // Inicialização do Carrossel: Este método configura o loop de rotação automática dos slides.
  private iniciarCarrossel(trocaImediata: boolean = false) {
    this.carrosselIniciado = true;
    const slides = this.availableSlides;

    if (slides.length <= 1) {
      this.activeSlide = 0;
      this.cdr.detectChanges();
      return;
    }

    if (trocaImediata && !this.isHovered) {
      this.avancarSlide();
    }

    // Limpa qualquer intervalo perdido por segurança
    if (this.carrosselInterval) {
      clearInterval(this.carrosselInterval);
    }

    // Configura o loop infinito: a cada 7 segundos, tenta avançar
    this.carrosselInterval = setInterval(() => {
      // Se o mouse estiver em cima, pulamos o avanço
      if (!this.isHovered) {
        this.avancarSlide();
      }
    }, 7000);
  }

  // Lógica para avançar apenas entre os slides disponíveis
  private avancarSlide() {
    const slides = this.availableSlides;
    
    if (slides.length <= 1) {
      this.activeSlide = 0;
      if (this.carrosselInterval) {
        clearInterval(this.carrosselInterval);
        this.carrosselInterval = null;
      }
      this.cdr.detectChanges();
      return;
    }

    let currentIndex = slides.indexOf(this.activeSlide);
    if (currentIndex === -1) currentIndex = 0;
    
    const nextIndex = (currentIndex + 1) % slides.length;
    this.activeSlide = slides[nextIndex];
    this.cdr.detectChanges(); 
  }

  // Pausa a rotação do carrossel marcando a flag de hover
  pausarCarrossel() {
    this.isHovered = true;
  }

  // Retoma a rotação do carrossel desmarcando a flag
  retomarCarrossel() {
    this.isHovered = false;
  }
}