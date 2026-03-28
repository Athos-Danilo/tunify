import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest'; // A nova máquina do tempo nativa!

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    
    // ========================================================================= //
    // 🚨 A MENTIRA PERFEITA (MOCKS)
    // Enganamos o Navegador Fantasma para ele não capotar com coisas visuais
    // ========================================================================= //
    (window as any).FinisherHeader = class { constructor() {} }; // Finge que a lib existe
    window.scrollTo = () => {}; // Finge que a tela consegue rolar

    // 1. O TestBed é o "Simulador de Navegador" do Angular
    await TestBed.configureTestingModule({
      imports: [HomeComponent], 
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: of({}) } 
        }
      ]
    })
    .compileComponents();
    
    // 2. Cria a "Cobaia" física do componente
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    // ========================================================================= //
    // 🚨 O ESCUDO ANTI-CANVAS (HACK UNIVERSAL)
    // Como estamos num ambiente de testes moderno, em vez de usar spyOn, 
    // nós simplesmente esvaziamos as funções visuais antes do componente nascer!
    // ========================================================================= //
    component.iniciarOndaFluida = () => {}; 
    component.renderizarFundo = () => {};

    // O JSDOM não conhece o IntersectionObserver, então criamos um falso:
    (window as any).IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
    
    // 3. Dá o primeiro 'play' no Angular (dispara o ngOnInit e ngAfterViewInit)
    fixture.detectChanges();
  });

  // ========================================================================= //
  // --- TESTE 1: TESTE DE VIDA (Sobrevivência do Componente)
  // ========================================================================= //
  it('deve nascer sem erros (Should Create)', () => {
    // Se o componente não capotar na criação, ele passa aqui!
    expect(component).toBeTruthy();
  });

  // ========================================================================= //
  // --- TESTE 2: TESTE DE ESTADO INICIAL
  // ========================================================================= //
  it('deve nascer com o modoEscuro ativado e textos travados', () => {
    // Usamos o .toBe() universal para fugir da briga de dialetos do Jest/Jasmine
    expect(component.modoEscuro).toBe(true);
    expect(component.animarTextos).toBe(false);
  });

  // ========================================================================= //
  // --- TESTE 3: A REENCARNAÇÃO DO BOTÃO SPOTIFY (Viagem no Tempo Vitest)
  // ========================================================================= //
  it('deve destruir e recriar o botão do Spotify em 10ms para forçar animação', () => {
    
    // 0. LIGA A MÁQUINA DO TEMPO DO VITEST
    vi.useFakeTimers();

    // 1. ESTADO INICIAL: O botão começa vivo
    expect(component.mostrarBotaoSpotify).toBe(true);
    expect(component.fazerPuloRapido).toBe(false);

    // 2. A AÇÃO: Usuário clicou
    component.voltarParaHeroEAnimar();

    // 3. A MORTE: Botão some do HTML
    expect(component.mostrarBotaoSpotify).toBe(false);
    expect(component.fazerPuloRapido).toBe(true);

    // 4. A VIAGEM NO TEMPO: Avançamos o relógio do universo em exatos 10ms!
    vi.advanceTimersByTime(10);

    // 5. A REENCARNAÇÃO: O botão tem que ter voltado à vida
    expect(component.mostrarBotaoSpotify).toBe(true);

    // 6. DESLIGA A MÁQUINA DO TEMPO (Para não bugar os próximos testes)
    vi.useRealTimers();
  });

  // ========================================================================= //
  // --- TESTE 4: O INTERRUPTOR DE TEMA (Light / Dark Mode)
  // ========================================================================= //
  it('deve alternar o tema Escuro/Claro ao chamar alternarTema()', () => {
    // 1. Estado Inicial: Nasce escuro
    expect(component.modoEscuro).toBe(true);

    // 2. Ação: Clica no botão de tema
    component.alternarTema();

    // 3. Verificação: Tem que ter ficado claro
    expect(component.modoEscuro).toBe(false);

    // 4. Ação: Clica de novo
    component.alternarTema();

    // 5. Verificação: Voltou pro escuro
    expect(component.modoEscuro).toBe(true);
  });

  // ========================================================================= //
  // --- TESTE 5: O ROBÔ DOS CARDS 3x2 (setInterval)
  // ========================================================================= //
  it('deve mudar o card ativo automaticamente a cada 3.5 segundos', () => {
    // 0. Liga a Máquina do Tempo
    vi.useFakeTimers();

    // 1. Dá o play no motor automático
    component.iniciarCarrosselCards();

    // 2. Anota qual card está virado agora (provavelmente o 1)
    const cardInicial = component.cardAtivo;

    // 3. Avança o tempo em exatos 3.5 segundos (3500ms)
    vi.advanceTimersByTime(3500);

    // 4. A IA do componente tem que ter sorteado um número diferente do inicial
    expect(component.cardAtivo).not.toBe(cardInicial);

    // 5. Verificando o Freio de Mão (Usuário colocou o mouse no Card 5)
    component.pausarAnimacao(5);
    expect(component.cardAtivo).toBe(5);

    // 6. Desliga as máquinas para não vazar pro próximo teste
    component.pararCarrosselCards();
    vi.useRealTimers();
  });


  // ========================================================================= //
  // --- TESTE 6: A MÁQUINA DE MÚSICAS (Frustração e Lixeiro do +1)
  // ========================================================================= //
  it('deve avançar a música, gerar o skip (+1) e destruí-lo após 2.5s', () => {
    // 0. Liga a Máquina do Tempo
    vi.useFakeTimers();

    // 1. Estado Inicial: Música 0 e nenhum "+1" na tela
    const indexInicial = component.indexMusicaAtual;
    expect(component.skips.length).toBe(0);

    // 2. Ação: Usuário pulou a música
    component.pularMusica();

    // 3. Verificação 1: Avançou para a próxima música?
    expect(component.indexMusicaAtual).toBe(indexInicial + 1);
    
    // 4. Verificação 2: Gerou o número flutuante (+1) na tela?
    expect(component.skips.length).toBe(1);
    expect(component.skips[0].id).toBe(1); // O ID tem que ser 1

    // 5. O LIXEIRO: Avançamos exatos 2.5 segundos (2500ms) no futuro
    vi.advanceTimersByTime(2500);

    // 6. Verificação Final: O número flutuante foi apagado da memória?
    expect(component.skips.length).toBe(0);

    // 7. Desliga a Máquina
    vi.useRealTimers();
  });

  // ========================================================================= //
  // --- TESTE 7: O PORTEIRO DO OAUTH (Redirecionamento)
  // ========================================================================= //
  it('deve redirecionar o usuário para a API do Spotify no backend (fazerLogin)', () => {
    // 1. O SEQUESTRO: Guardamos a URL original
    const originalLocation = window.location;
    
    // 2. A VENDA NOS OLHOS DO TYPESCRIPT: 
    // Usamos '(window as any)' para ele não reclamar de estarmos hackeando a barra de endereços
    delete (window as any).location;
    (window as any).location = { href: '' };

    // 3. Ação: O usuário clica no botão "Conectar com o Spotify"
    component.fazerLogin();

    // 4. Verificação: O componente tentou mandar o usuário pro lugar certo?
    expect((window as any).location.href).toBe('http://127.0.0.1:8000/api/v1/auth/login');

    // 5. A DEVOLUÇÃO: Devolvemos a URL original para os próximos testes
    (window as any).location = originalLocation;
  });

});