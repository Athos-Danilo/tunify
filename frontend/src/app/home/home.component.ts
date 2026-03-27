// Ferramentas base do Angular.
// --- ADICIONADO PARA ANIMAÇÕES ---: Renderer2 e HostListener
import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef, Renderer2, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LogoComponent } from '../components/logo.component';
import { RouterModule } from '@angular/router'; 

// Importa ferramentas comuns, essenciais para as diretivas do HTML (como ngClass e ngFor).
import { CommonModule } from '@angular/common';

// Variável global do fundo animado (Canvas).
declare var FinisherHeader: any;

// Molde do Contador, estrutura dos números flutuantes (+1).
interface SkipsContados {
  id: number;
}

// Molde das Músicas.
interface Musica {
  nome: string;
  artista: string;
  duracao: string;
  capa: string;     
  energia: string;  
  valencia: string;
  acustica: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LogoComponent, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {            
  
  // ======> Estado Global da Tela.
  // 1) modoEscuro: Controla qual configuração do Canvas será carregada;
  // 2) animarTextos: Trava a cascata de animação até o tempo do preloader esgotar.
  // --------------------------------------------------------------------------------- //
  title = 'Tunify';
  modoEscuro = true;
  animarTextos = false;

  // ========================================================================= //
  // --- VARIÁVEIS DOS MONITORES DE BPM (SEÇÃO 3) ---
  // ========================================================================= //
  bpmCaos: number | string = '--';
  bpmFlow: number = 72;
  private timerBpmCaos: any;
  private timerBpmFlow: any;

  // ======> Estado da Simulação de Frustração.
  // 1) skips (Pulos): A lista que segura os objetos "+1" ativos na tela;
  // 2) totalSkips: O contador numérico interno para gerar os IDs;
  // 3) btnSkipActive: Controla o CSS de pulso/afundamento do botão Next (>|).
  // ---------------------------------------------------------------------------- //
  skips: SkipsContados[] = []; 
  totalSkips = 0; 
  btnSkipActive = false; 

  // --- NOVAS VARIÁVEIS DE CONTROLE BLINDADO ---
  simulacaoAtiva = true; // O "Botão de Pânico" contra os fantasmas do Hot Reload
  isResetando = true; // Trava explícita para o CSS  

  // ======> Conexões com a DOM.
  // 1) headerContainer: Captura a div pai para manipular o elemento <canvas>.
  // ---------------------------------------------------------------------------- //
  @ViewChild('headerContainer') headerContainer!: ElementRef;

  // --- VARIÁVEIS DA ONDA FLUIDA (CANVAS) <--- NOVO AQUI ---
  @ViewChild('ondaCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private tempoOnda = 0; 
  private animationFrameId!: number;

  // --- ADICIONADO PARA ANIMAÇÕES ---
  // Variáveis para guardar estado do scroll e os elementos que vão aparecer
  private elementosAnimados: HTMLElement[] = [];
  private canvasY: number = 0;

  // ========================================================================= //
  // --- VARIÁVEIS DO NOVO GRID 3X2 (CARDS VIVOS) ---
  // ========================================================================= //
  cardAtivo: number = 1; // Qual card está virado no momento (1 a 6)
  private timerCards: any; // Guarda o relógio (setInterval) da animação automática

  // ======> Construtor e Injeção de Dependências.
  // 1) cdr: O "despertador" manual, usado para forçar o Angular a atualizar a tela quando
  //    funções assíncronas (como setTimeout) alteram variáveis.
  // --- ADICIONADO PARA ANIMAÇÕES ---: private renderer: Renderer2
  // ---------------------------------------------------------------------------------------- //
  constructor(private cdr: ChangeDetectorRef, private renderer: Renderer2, private el: ElementRef) {}

  // Lista de Músicas.
  playlist: Musica[] = [
    { nome: "Bohemian Rhapsody", artista: "Queen", duracao: "5:54", capa: "/albuns/bohemianrhapsody.webp", energia: "0.40", valencia: "0.22", acustica: "0.27" },
    { nome: "Blinding Lights", artista: "The Weeknd", duracao: "3:20", capa: "/albuns/blindinglights.webp", energia: "0.73", valencia: "0.33", acustica: "0.00" },
    { nome: "We can't be friends", artista: "Ariana Grande", duracao: "3:48", capa: "/albuns/wecantbefriends.webp", energia: "0.66", valencia: "0.59", acustica: "0.06" },
    { nome: "Shape of You", artista: "Ed Sheeran", duracao: "3:53", capa: "/albuns/shapeofyou.webp", energia: "0.65", valencia: "0.93", acustica: "0.58" },
    { nome: "Sorry", artista: "Justin Bieber", duracao: "3:20", capa: "/albuns/sorry.webp", energia: "0.76", valencia: "0.41", acustica: "0.08" },
    { nome: "Billie Jean", artista: "Michael Jackson", duracao: "4:54", capa: "/albuns/billiejean.webp", energia: "0.65", valencia: "0.84", acustica: "0.02" },
    { nome: "As It Was", artista: "Harry Styles", duracao: "2:47", capa: "/albuns/asitwas.webp", energia: "0.73", valencia: "0.66", acustica: "0.34" },
    { nome: "Circles", artista: "Post Malone", duracao: "3:35", capa: "/albuns/circles.webp", energia: "0.76", valencia: "0.55", acustica: "0.19" },
    { nome: "WILDFLOWER", artista: "Billie Eilish", duracao: "4:21", capa: "/albuns/wildflower.webp", energia: "0.35", valencia: "0.56", acustica: "0.35" },
    { nome: "Cruel Summer", artista: "Taylor Swift", duracao: "2:58", capa: "/albuns/cruelsummer.webp", energia: "0.70", valencia: "0.56", acustica: "0.11" },
  ];
  
  // Controladores da música atual
  indexMusicaAtual = 0;
  musicaAtual: Musica = this.playlist[0];

  // Variáveis para a Timeline.
  tempoExibicao = '0:00';
  isTocando = false;

  // ======> Ciclo de Vida: Nascimento.
  // 1) Dispara a simulação de botões assim que a página é construída.
  // -------------------------------------------------------------------- //
  ngOnInit() {
    // 1. Mata a memória de scroll do navegador (para ele não descer a tela sozinho no F5)
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    // 2. Força a tela para o topo absoluto (Seção 1)
    window.scrollTo(0, 0);
    // 3. Arranca a barra de rolagem (Trava o mouse)
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    // ------------------------------------

    this.iniciarSimulacaoSkips();
    this.iniciarCarrosselCards(); // <--- CHAMA A ANIMAÇÃO DOS CARDS AQUI
  }

  // ======> Ciclo de Vida: Pós-Renderização.
  // 1) Aguarda 5 segundos (tempo do preloader visual) para soltar a trava dos textos;
  // 2) Acorda o Angular para injetar a classe 'play-animacoes' no HTML.
  // ------------------------------------------------------------------------------------ //
  ngAfterViewInit() {
    this.renderizarFundo(); 
    this.iniciarOndaFluida();

    // --- ADICIONADO PARA ANIMAÇÕES ---: Aciona o vigia de scroll
    this.configurarAnimacoesScroll();

    setTimeout(() => {
      this.animarTextos = true;
      // --- 🚨 A LIBERTAÇÃO ---
      // 4. O tempo do Loader acabou! Devolvemos a barra de rolagem pro usuário.
      this.renderer.removeStyle(document.body, 'overflow');
      this.cdr.detectChanges(); 
    }, 5000);
  }

  // MATA OS FANTASMAS: Quando o Angular recarregar, ele desativa o motor antigo!
  ngOnDestroy() {
    this.simulacaoAtiva = false;
    cancelAnimationFrame(this.animationFrameId); 
    this.pararCarrosselCards(); // <--- MATA O RELÓGIO DOS CARDS AO SAIR
  }

  // ======> O Contador de Passar Músicas.
  // 1) Cria um ciclo de 3 segundos entre cada ação;
  // 2) Simula o dedo afundando o botão (ativa a classe CSS correspondente);
  // 3) Aguarda 400ms (tempo físico do clique) para soltar o botão e instanciar o "+1";
  // 4) Configura a autodestruição do "+1" instanciado após o fim do seu CSS (2.5s);
  // 5) Troca a música toda vez que pula.
  // 6) Tempo da música tocando.
  // ------------------------------------------------------------------------------------- //
  // Dá o pontapé inicial na nossa engrenagem
  iniciarSimulacaoSkips() {
    this.simulacaoAtiva = true;
    this.cicloDeFrustracao();
  }

  // O Motor Blindado
  cicloDeFrustracao() {
    if (!this.simulacaoAtiva) return;

    // 1. O CORTE SECO (Desliga a animação, o CSS zera a barra instantaneamente)
    this.isTocando = false; 
    this.tempoExibicao = '0:00';
    this.btnSkipActive = false; 
    this.cdr.detectChanges();

    // 2. O PLAY DA MÚSICA (Espera 50ms e injeta a animação)
    setTimeout(() => {
      if (!this.simulacaoAtiva) return;
      this.isTocando = true; // Ativa o keyframe de 3.2 segundos
      this.cdr.detectChanges();
    }, 50);

    // 3. O CRONÔMETRO DE TEXTO (Separado da barra)
    setTimeout(() => { if (this.simulacaoAtiva) { this.tempoExibicao = '0:01'; this.cdr.detectChanges(); } }, 1000);
    setTimeout(() => { if (this.simulacaoAtiva) { this.tempoExibicao = '0:02'; this.cdr.detectChanges(); } }, 2000);
    setTimeout(() => { if (this.simulacaoAtiva) { this.tempoExibicao = '0:03'; this.cdr.detectChanges(); } }, 3000);

    // 4. O CLIQUE
    setTimeout(() => {
      if (!this.simulacaoAtiva) return;
      this.btnSkipActive = true;
      this.cdr.detectChanges();
    }, 3200);

    // 5. A TROCA E O RECOMEÇO
    setTimeout(() => {
      if (!this.simulacaoAtiva) return;
      this.pularMusica(); 
      this.cicloDeFrustracao(); 
    }, 3600);
  }

  // Trocar a Música.
  pularMusica() {
    // Avança na playlist.
    this.indexMusicaAtual = (this.indexMusicaAtual + 1) % this.playlist.length;
    this.musicaAtual = this.playlist[this.indexMusicaAtual];

    // Gera o +1 flutuante.
    this.totalSkips++; 
    const novoSkip: SkipsContados = { id: this.totalSkips };
    this.skips.push(novoSkip); 
    this.cdr.detectChanges();

    // Lixeiro do +1.
    setTimeout(() => {
      this.removerSkip(novoSkip.id);
    }, 2500);
  }

  // ======> Lixeiro da Animação.
  // 1) Recebe o ID do elemento que terminou de voar;
  // 2) Filtra a lista principal removendo apenas ele, evitando vazamento de memória.
  // ----------------------------------------------------------------------------------- //
  removerSkip(id: number) {
    this.skips = this.skips.filter(s => s.id !== id);
    this.cdr.detectChanges(); 
  }

  // ======> Seletor de Tema.
  // 1) Inverte o booleano principal e re-desenha a tela de fundo inteira.
  // ------------------------------------------------------------------------ //
  alternarTema() {
    this.modoEscuro = !this.modoEscuro; 
    this.renderizarFundo();
  }

  // ======> Pintor do Fundo (Canvas).
  // 1) Busca se já existe um Canvas antigo rodando na div pai;
  // 2) Destrói o antigo caso exista;
  // 3) Lê qual a configuração de cores usar e inicializa o FinisherHeader novo.
  // ------------------------------------------------------------------------------ //
  renderizarFundo() {
    const container = this.headerContainer.nativeElement;
    const canvasAntigo = container.querySelector('canvas');
    if (canvasAntigo) {
      canvasAntigo.remove();
    }

    const config = this.modoEscuro ? this.getConfigDark() : this.getConfigLight();
    new FinisherHeader(config);
  }

  // ======> Esquema de Cores: Modo Escuro.
  getConfigDark() {
    return {
      "count": 12,
      "size": { "min": 1000, "max": 1500, "pulse": 1 },
      "speed": { "x": { "min": 0.6, "max": 3 }, "y": { "min": 0.6, "max": 3 } },
      "colors": {
        "background": "#0b1120",
        "particles": ["#0b1120", "#151e32", "#1e2e48", "#263c5e", "#22406e"]
      },
      "blending": "lighten",
      "opacity": { "center": 0.6, "edge": 0 },
      "skew": 0,
      "shapes": ["c"]
    };
  }

  // ======> Esquema de Cores: Modo Claro.
  getConfigLight() {
    return {
      "count": 12,
      "size": { "min": 1000, "max": 1500, "pulse": 0 },
      "speed": { "x": { "min": 0.3, "max": 2 }, "y": { "min": 0.6, "max": 3 } },
      "colors": {
        "background": "#FFFFFF",
        "particles": ["#FFFFFF", "#EEEEEE", "#CFCFCF", "#7e7d7d", "#656464"]
      },
      "blending": "lighten",
      "opacity": { "center": 0.6, "edge": 0 },
      "skew": 0,
      "shapes": ["c"]
    };
  }

  // ======> Porteiro do Sistema.
  // 1) Dispara a navegação direta para o backend iniciar o fluxo Oauth2.
  // ----------------------------------------------------------------------- //
  fazerLogin() {
    window.location.href = 'http://127.0.0.1:8000/api/v1/auth/login';
  }

  // ======> MOTOR DA ONDA FLUIDA (CANVAS) <--- NOVO AQUI ---
  // 1) Usa trigonometria (Math.sin) para desenhar uma onda orgânica.
  // ------------------------------------------------------------------------ //
  iniciarOndaFluida() {
    if (!this.canvasRef) return;

    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    
    canvas.width = window.innerWidth;
    canvas.height = 60;

    const desenharFrame = () => {
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      this.ctx.beginPath();
      this.ctx.moveTo(0, canvas.height / 2);

      // O pulso que faz a onda "bater" mais forte e mais fraco
      const batida = Math.sin(this.tempoOnda * 2.5) * 0.4 + 1; 

      for (let x = 0; x < canvas.width; x++) {
        
        // A MÁGICA DO SILÊNCIO: Cria bolsões onde a onda zera (linha reta)
        // O "+ 0.2" controla o tamanho do silêncio. Quanto menor, mais tempo a linha fica reta.
        const mascaraSilencio = Math.max(0, Math.sin(x * 0.003 - this.tempoOnda * 1.2) + 0.2);

        // A MÁGICA DA DIREÇÃO: Todos os "tempoOnda" usam sinal de MENOS (-) para fluir para a Direita.
        const y = (
            Math.sin(x * 0.015 - this.tempoOnda * 3.0) * 8  // Grave longo
          + Math.sin(x * 0.040 - this.tempoOnda * 4.0) * 6  // Médio
          + Math.sin(x * 0.090 - this.tempoOnda * 5.0) * 4  // Agudo 
          + Math.sin(x * 0.200 - this.tempoOnda * 6.0) * 2  // Textura rasgada
        ) * batida * mascaraSilencio; // Multiplicamos pela máscara para gerar as pausas!

        this.ctx.lineTo(x, canvas.height / 2 + y);
      }

      this.ctx.strokeStyle = '#0285ff';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      this.tempoOnda += 0.02; 
      this.animationFrameId = requestAnimationFrame(desenharFrame);
    };

    desenharFrame();
  }

  // 1. O botão sempre começa visível
  mostrarBotaoSpotify: boolean = true;
  // 2. Controla se ele usa a animação lenta (padrão) ou a rápida
  fazerPuloRapido: boolean = false;

  voltarParaHeroEAnimar() {
    // Rola a tela
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 3. A REENCARNAÇÃO: Destrói o botão no HTML
    this.mostrarBotaoSpotify = false;
    
    // 4. Avisa que quando ele voltar, tem que ser com a classe rápida
    this.fazerPuloRapido = true;

    // 5. Recria o botão quase instantaneamente (10 milissegundos).
    // O usuário nem vai ver ele sumindo porque a tela ainda vai estar rolando lá pra cima!
    setTimeout(() => {
      this.mostrarBotaoSpotify = true;
    }, 10); 
  }
  
  // ========================================================================= //
  // --- ADICIONADO PARA ANIMAÇÕES ---: BLOCO NOVO DE EFEITOS ESPECIAIS
  // ========================================================================= //

  // EFEITO 1: Fade-in e Slide Up (IntersectionObserver)
  private configurarAnimacoesScroll() {
    this.elementosAnimados = Array.from(this.el.nativeElement.querySelectorAll('.animacao-fade-in'));
    
    const options = { root: null, rootMargin: '-10% 0px', threshold: 0.1 };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.renderer.addClass(entry.target, 'visivel');
          obs.unobserve(entry.target); 
        }
      });
    }, options);

    this.elementosAnimados.forEach(elemento => observer.observe(elemento));
  }

  // ========================================================================= //
  // --- A MÁGICA VIVA DO GRID 3X2 (INTERAÇÃO DOS CARDS) ---
  // ========================================================================= //

  // 1) O Gatilho Automático (O Robô Sênior rodando em segundo plano)
  iniciarCarrosselCards() {
    // Garante que não tenha dois relógios malucos rodando juntos
    this.pararCarrosselCards();

    // A cada 3.5 segundos, a IA escolhe um card aleatório para virar
    this.timerCards = setInterval(() => {
      let proximoCard;
      do {
        proximoCard = Math.floor(Math.random() * 6) + 1; // Rola um "dado" de 6 lados (1 a 6)
      } while (proximoCard === this.cardAtivo); // Evita bater duas vezes no mesmo número
      
      this.cardAtivo = proximoCard;
      this.cdr.detectChanges(); // Acorda o Angular para injetar a classe no HTML
    }, 3500); 
  }

  // 2) O Freio de Mão (Mata o relógio)
  pararCarrosselCards() {
    if (this.timerCards) {
      clearInterval(this.timerCards);
    }
  }

  // 3) A Interação Humana: O usuário apontou o mouse
  pausarAnimacao(idCard: number) {
    this.pararCarrosselCards(); // Manda o robô automático dormir
    this.cardAtivo = idCard; // Vira instantaneamente o card que o usuário quer ver
    this.cdr.detectChanges();
  }

  // 4) A Fuga: O usuário tirou o mouse
  retomarAnimacao() {
    this.iniciarCarrosselCards(); // Acorda o robô para voltar a sortear cards
  }



}