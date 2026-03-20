// Ferramentas base do Angular.
import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';

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
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, AfterViewInit {            
  
  // ======> Estado Global da Tela.
  // 1) modoEscuro: Controla qual configuração do Canvas será carregada;
  // 2) animarTextos: Trava a cascata de animação até o tempo do preloader esgotar.
  // --------------------------------------------------------------------------------- //
  title = 'Tunify';
  modoEscuro = true;
  animarTextos = false;

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

  // ======> Construtor e Injeção de Dependências.
  // 1) cdr: O "despertador" manual, usado para forçar o Angular a atualizar a tela quando
  //    funções assíncronas (como setTimeout) alteram variáveis.
  // ---------------------------------------------------------------------------------------- //
  constructor(private cdr: ChangeDetectorRef) {}

  // Lista de Músicas.
  playlist: Musica[] = [
    { nome: "Bohemian Rhapsody", artista: "Queen", duracao: "5:54" },
    { nome: "Blinding Lights", artista: "The Weeknd", duracao: "3:20" },
    { nome: "We can't be friends (wait for your love)", artista: "Ariana Grande", duracao: "3:48" },
    { nome: "Shape of You", artista: "Ed Sheeran", duracao: "3:53" },
    { nome: "Sorry", artista: "Justin Bieber", duracao: "3:20" },
    { nome: "Billie Jean", artista: "Michael Jackson", duracao: "4:54" },
    { nome: "As It Was", artista: "Harry Styles", duracao: "2:47" },
    { nome: "Cirles", artista: "Post Malone", duracao: "3:35" },
    { nome: "Chihiro", artista: "Billie Eilish", duracao: "5:03" },
    { nome: "Opalite", artista: "Taylor Swift", duracao: "3:55" }
  ];
  
  // Controladores da música atual
  indexMusicaAtual = 0;
  musicaAtual: Musica = this.playlist[0]

  // Variáveis para a Timeline.
  tempoExibicao = '0:00';
  isTocando = false;

  // ======> Ciclo de Vida: Nascimento.
  // 1) Dispara a simulação de botões assim que a página é construída.
  // -------------------------------------------------------------------- //
  ngOnInit() {
    this.iniciarSimulacaoSkips();
  }

  // ======> Ciclo de Vida: Pós-Renderização.
  // 1) Aguarda 5 segundos (tempo do preloader visual) para soltar a trava dos textos;
  // 2) Acorda o Angular para injetar a classe 'play-animacoes' no HTML.
  // ------------------------------------------------------------------------------------ //
  ngAfterViewInit() {
    this.renderizarFundo(); 

    setTimeout(() => {
      this.animarTextos = true;
      this.cdr.detectChanges(); 
    }, 5000);
  }

  // MATA OS FANTASMAS: Quando o Angular recarregar, ele desativa o motor antigo!
  ngOnDestroy() {
    this.simulacaoAtiva = false; 
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
}