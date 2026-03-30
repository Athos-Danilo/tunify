// ======> Importações do Angular e Componentes.
// 1) Importa ferramentas base do Angular (Lifecycle hooks, manipulação de DOM);
// 2) Importa roteamento e módulos comuns (ngClass, ngFor);
// 3) Importa o componente de Logo da aplicação.
// ------------------------------------------------------------------------------ //
import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef, Renderer2, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LogoComponent } from '../../components/logo.component';
import { RouterModule } from '@angular/router'; 
import { CommonModule } from '@angular/common';

// ======> Variáveis Globais Externas.
// 1) FinisherHeader: Instância da biblioteca externa do fundo animado (Canvas).
// ------------------------------------------------------------------------------ //
declare var FinisherHeader: any;

// ======> Interfaces de Tipagem (Moldes de Dados).
// 1) SkipsContados: Molde do Contador, estrutura dos números flutuantes (+1);
// 2) Musica: Molde de dados para as faixas da playlist.
// ------------------------------------------------------------------------------ //
interface SkipsContados {
  id: number;
}

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
  // 1) title: Nome da aplicação;
  // 2) modoEscuro: Controla qual configuração do Canvas será carregada;
  // 3) animarTextos: Trava a cascata de animação até o tempo do preloader esgotar.
  // ------------------------------------------------------------------------------ //
  title = 'Tunify';
  modoEscuro = true;
  animarTextos = false;

  // ======> Variáveis dos Monitores de BPM (Seção 3).
  // 1) bpmCaos / bpmFlow: Valores exibidos nos cards numéricos;
  // ------------------------------------------------------------------------------ //
  bpmCaos: number | string = '--';
  bpmFlow: number = 72;
  

  // ======> Estado da Simulação de Frustração (Skips).
  // 1) skips (Pulos): A lista que segura os objetos "+1" ativos na tela;
  // 2) totalSkips: O contador numérico interno para gerar os IDs;
  // 3) btnSkipActive: Controla o CSS de pulso/afundamento do botão Next (>|);
  // 4) simulacaoAtiva: O "Botão de Pânico" contra os fantasmas do Hot Reload;
  // 5) isResetando: Trava explícita para o CSS.
  // ------------------------------------------------------------------------------ //
  skips: SkipsContados[] = []; 
  totalSkips = 0; 
  btnSkipActive = false; 
  simulacaoAtiva = true; 
  isResetando = true;  

  // ======> Estado do Botão Spotify (Hero).
  // 1) mostrarBotaoSpotify: Controla a renderização do botão no DOM (*ngIf);
  // 2) fazerPuloRapido: Controla se ele usa a animação lenta (padrão) ou a rápida.
  // ------------------------------------------------------------------------------ //
  mostrarBotaoSpotify: boolean = true;
  fazerPuloRapido: boolean = false;

  // ======> Conexões com a DOM (ViewChild).
  // 1) headerContainer: Captura a div pai para manipular o fundo FinisherHeader;
  // 2) canvasRef: Captura o canvas específico para desenhar a onda fluida.
  // ------------------------------------------------------------------------------ //
  @ViewChild('headerContainer') headerContainer!: ElementRef;
  @ViewChild('ondaCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  // ======> Variáveis da Onda Fluida (Canvas).
  // 1) ctx: Contexto 2D de renderização;
  // 2) tempoOnda: Fator de progressão matemática da onda;
  // 3) animationFrameId: ID do loop para poder matar a animação depois.
  // ------------------------------------------------------------------------------ //
  private ctx!: CanvasRenderingContext2D;
  private tempoOnda = 0; 
  private animationFrameId!: number;

  // ======> Variáveis de Animação de Scroll (IntersectionObserver).
  // 1) elementosAnimados: Guarda os elementos do DOM que vão sofrer fade-in;
  // ------------------------------------------------------------------------------ //
  private elementosAnimados: HTMLElement[] = [];
  private canvasY: number = 0;

  // ======> Variáveis do Grid 3x2 (Cards Vivos).
  // 1) cardAtivo: Controla qual card está virado no momento (1 a 6);
  // 2) timerCards: Guarda o relógio (setInterval) da animação automática.
  // ------------------------------------------------------------------------------ //
  cardAtivo: number = 1; 
  private timerCards: any; 

  // ======> Estado do Player e Playlist.
  // 1) playlist: Array contendo todas as músicas disponíveis;
  // 2) indexMusicaAtual: Rastreia a posição atual na playlist;
  // 3) musicaAtual: O objeto da música sendo tocada agora;
  // 4) tempoExibicao: Controla o texto do relógio na UI;
  // 5) isTocando: Controla a barra de progresso CSS.
  // ------------------------------------------------------------------------------ //
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
  indexMusicaAtual = 0;
  musicaAtual: Musica = this.playlist[0];
  tempoExibicao = '0:00';
  isTocando = false;

  // ======> Construtor e Injeção de Dependências.
  // 1) cdr: Despertador manual, força o Angular a atualizar a tela via setTimeout;
  // 2) renderer: Ferramenta segura para injetar/remover classes e estilos no DOM;
  // 3) el: Referência nativa do componente para buscar elementos HTML.
  // ------------------------------------------------------------------------------ //
  constructor(private cdr: ChangeDetectorRef, private renderer: Renderer2, private el: ElementRef) {}

  // ======> Ciclo de Vida: Nascimento (ngOnInit).
  // 1) Mata a memória de scroll do navegador (para não descer a tela no F5);
  // 2) Força a tela para o topo absoluto (Seção 1);
  // 3) Trava a barra de rolagem (overflow: hidden);
  // 4) Inicia as animações autônomas (Skips e Carrossel de Cards).
  // ------------------------------------------------------------------------------ //
  ngOnInit() {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    this.renderer.setStyle(document.body, 'overflow', 'hidden');

    this.iniciarSimulacaoSkips();
    this.iniciarCarrosselCards(); 
  }

  // ======> Ciclo de Vida: Pós-Renderização (ngAfterViewInit).
  // 1) Renderiza o Canvas de fundo e a onda fluida;
  // 2) Aciona o vigia de scroll para as animações Fade-In;
  // 3) Aguarda 5s (preloader visual) para destravar a rolagem e iniciar textos.
  // ------------------------------------------------------------------------------ //
  ngAfterViewInit() {
    this.renderizarFundo(); 
    this.iniciarOndaFluida();
    this.configurarAnimacoesScroll();

    setTimeout(() => {
      this.animarTextos = true;
      this.renderer.removeStyle(document.body, 'overflow');
      this.cdr.detectChanges(); 
    }, 5000);
  }

  // ======> Ciclo de Vida: Destruição (ngOnDestroy).
  // 1) Desliga o motor de skips blindando contra falhas de hot reload;
  // 2) Cancela a renderização contínua do Canvas (requestAnimationFrame);
  // 3) Mata o relógio dos cards.
  // ------------------------------------------------------------------------------ //
  ngOnDestroy() {
    this.simulacaoAtiva = false;
    cancelAnimationFrame(this.animationFrameId); 
    this.pararCarrosselCards(); 
  }

  // ======> Motor de Simulação de Frustração (Skips).
  // 1) iniciarSimulacaoSkips: Dá o pontapé inicial habilitando a variável de segurança;
  // 2) cicloDeFrustracao: Orquestra toda a timeline de cliques, textos e trocas.
  // ------------------------------------------------------------------------------ //
  iniciarSimulacaoSkips() {
    this.simulacaoAtiva = true;
    this.cicloDeFrustracao();
  }

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

    // 4. O CLIQUE (Afunda o botão)
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

  // ======> Ação de Troca de Música.
  // 1) Avança a playlist em loop usando módulo matemático (%);
  // 2) Gera e empurra um objeto "+1" flutuante para a tela;
  // 3) Agenda a autodestruição do "+1" após 2.5s.
  // ------------------------------------------------------------------------------ //
  pularMusica() {
    this.indexMusicaAtual = (this.indexMusicaAtual + 1) % this.playlist.length;
    this.musicaAtual = this.playlist[this.indexMusicaAtual];

    this.totalSkips++; 
    const novoSkip: SkipsContados = { id: this.totalSkips };
    this.skips.push(novoSkip); 
    this.cdr.detectChanges();

    setTimeout(() => {
      this.removerSkip(novoSkip.id);
    }, 2500);
  }

  // ======> Lixeiro da Animação (+1).
  // 1) Recebe o ID do elemento que terminou de voar;
  // 2) Filtra a lista principal removendo apenas ele, evitando vazamento de memória.
  // ------------------------------------------------------------------------------ //
  removerSkip(id: number) {
    this.skips = this.skips.filter(s => s.id !== id);
    this.cdr.detectChanges(); 
  }

  // ======> Seletor de Tema (Light/Dark).
  // 1) Inverte o booleano principal e re-desenha a tela de fundo inteira.
  // ------------------------------------------------------------------------------ //
  alternarTema() {
    this.modoEscuro = !this.modoEscuro; 
    this.renderizarFundo();
  }

  // ======> Pintor do Fundo (FinisherHeader Canvas).
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
  // 1) Retorna o objeto JSON de configuração para a lib externa.
  // ------------------------------------------------------------------------------ //
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
  // 1) Retorna o objeto JSON de configuração para a lib externa.
  // ------------------------------------------------------------------------------ //
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

  // ======> Porteiro do Sistema (OAuth2).
  // 1) Dispara a navegação direta para o backend iniciar o fluxo de login no Spotify.
  // ------------------------------------------------------------------------------ //
  fazerLogin() {
    window.location.href = 'http://127.0.0.1:8000/api/v1/auth/login';
  }

  // ======> Motor da Onda Fluida (Canvas Nativo).
  // 1) Injeta o contexto no elemento Canvas 2D;
  // 2) Usa trigonometria (Math.sin) para desenhar uma onda orgânica iterativa;
  // 3) Aplica "silêncio" matemático para criar batidas visuais e loops rítmicos.
  // ------------------------------------------------------------------------------ //
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
        const mascaraSilencio = Math.max(0, Math.sin(x * 0.003 - this.tempoOnda * 1.2) + 0.2);

        // A MÁGICA DA DIREÇÃO: Todos os "tempoOnda" usam sinal (-) para fluir para a Direita.
        const y = (
            Math.sin(x * 0.015 - this.tempoOnda * 3.0) * 8  // Grave longo
          + Math.sin(x * 0.040 - this.tempoOnda * 4.0) * 6  // Médio
          + Math.sin(x * 0.090 - this.tempoOnda * 5.0) * 4  // Agudo 
          + Math.sin(x * 0.200 - this.tempoOnda * 6.0) * 2  // Textura rasgada
        ) * batida * mascaraSilencio; 

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

  // ======> Efeito de Reencarnação (Botão Hero).
  // 1) Rola a tela até o topo absoluto;
  // 2) Destrói temporariamente o botão no DOM;
  // 3) Ativa a classe de animação turbo e recria o botão instantaneamente.
  // ------------------------------------------------------------------------------ //
  voltarParaHeroEAnimar() {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.mostrarBotaoSpotify = false;
    this.fazerPuloRapido = true;

    setTimeout(() => {
      this.mostrarBotaoSpotify = true;
    }, 10); 
  }
  
  // ======> Intersection Observer (Efeitos Especiais de Scroll).
  // 1) Cria um vigia que monitora os elementos com a classe .animacao-fade-in;
  // 2) Quando o elemento entra na tela (10% de margem), injeta a classe .visivel.
  // ------------------------------------------------------------------------------ //
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

  // ======> A Mágica Viva do Grid 3x2 (Interação dos Cards).
  // 1) iniciarCarrosselCards: Gatilho Automático (Robô em segundo plano virando cards);
  // 2) pararCarrosselCards: Freio de Mão (Mata o relógio);
  // 3) pausarAnimacao: Interação Humana (Usuário apontou o mouse);
  // 4) retomarAnimacao: Fuga (Usuário tirou o mouse).
  // ------------------------------------------------------------------------------ //
  iniciarCarrosselCards() {
    this.pararCarrosselCards();

    this.timerCards = setInterval(() => {
      let proximoCard;
      do {
        proximoCard = Math.floor(Math.random() * 6) + 1; 
      } while (proximoCard === this.cardAtivo); 
      
      this.cardAtivo = proximoCard;
      this.cdr.detectChanges(); 
    }, 3500); 
  }

  pararCarrosselCards() {
    if (this.timerCards) {
      clearInterval(this.timerCards);
    }
  }

  pausarAnimacao(idCard: number) {
    this.pararCarrosselCards(); 
    this.cardAtivo = idCard; 
    this.cdr.detectChanges();
  }

  retomarAnimacao() {
    this.iniciarCarrosselCards(); 
  }

}