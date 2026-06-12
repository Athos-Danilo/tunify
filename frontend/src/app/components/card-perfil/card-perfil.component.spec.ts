import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardPerfilComponent } from './card-perfil.component';
import { CommonModule } from '@angular/common';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('CardPerfilComponent', () => {
  let component: CardPerfilComponent;
  let fixture: ComponentFixture<CardPerfilComponent>;

  // O beforeEach é executado antes de cada teste ('it'). 
  // Usamos para configurar o ambiente e criar uma instância "fresca" do componente.
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPerfilComponent, CommonModule] // Como é Standalone, declaramos nos imports
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardPerfilComponent);
    component = fixture.componentInstance;
    
    // Fornecendo dados padrão para os Inputs obrigatórios usados no HTML
    component.dadosDemograficos = {
      tipo_conta: 'PREMIUM',
      foto_perfil: 'assets/perfil.jpg',
      total_playlists: 10,
      seguidores: 100,
      seguindo: 50
    };
  });

  // O afterEach é executado após cada teste.
  // Como estamos usando o Vitest, limpamos os timers falsos com useRealTimers()
  afterEach(() => {
    vi.useRealTimers();
  });

  // 1. TESTE DE CRIAÇÃO
  it('deve criar o componente instanciado', () => {
    expect(component).toBeTruthy();
  });

  // ----------------------------------------------------------------------------------
  // 2. TESTES DA SEQUÊNCIA DE ANIMAÇÃO (TIMERS DO NGONINIT)
  // ----------------------------------------------------------------------------------
  it('deve executar a sequência de animação inicial corretamente', () => {
    // Usamos vi.useFakeTimers() do Vitest para controlar os setTimeouts do Angular
    vi.useFakeTimers();

    component.nomeUsuario = 'Athos';
    
    // fixture.detectChanges() aciona o ciclo de vida inicial, como o ngOnInit.
    fixture.detectChanges(); 
    
    // Tempo 0: Preloader visível, nenhum texto apareceu
    expect(component.exibirSaudacao).toBe(false);
    expect(component.exibirNome).toBe(false);

    // Avançamos 4.9 segundos (4900ms) - Passo 2 da animação
    vi.advanceTimersByTime(4900);
    expect(component.exibirSaudacao).toBe(true); // Saudação deve aparecer
    expect(component.exibirNome).toBe(false);

    // Avançamos mais 4.5 segundos - Passo 3 da animação
    vi.advanceTimersByTime(4500);
    expect(component.exibirSaudacao).toBe(false); // Esconde saudação
    expect(component.exibirNome).toBe(true); // Mostra o nome

    // Avançamos os últimos 4 segundos - Passo 4 (Início do carrossel)
    vi.advanceTimersByTime(4000);
    
    expect(component['carrosselIniciado']).toBe(true);

    // Limpamos o intervalo que foi criado no carrossel para não vazar pro resto do teste
    if (component['carrosselInterval']) {
      clearInterval(component['carrosselInterval']);
    }
    vi.clearAllTimers();
  });

  // ----------------------------------------------------------------------------------
  // 3. TESTES DA LÓGICA DE SAUDAÇÃO BASEADA NO HORÁRIO (avaliarSaudacao)
  // Usamos os recursos do Vitest (vi.setSystemTime) para mockar a data
  // ----------------------------------------------------------------------------------
  it('deve exibir "Bom Dia!" se a hora for entre 5h e 11h', () => {
    const baseTime = new Date(2026, 5, 11, 8, 0, 0); // Mock 08:00 AM
    vi.useFakeTimers();
    vi.setSystemTime(baseTime);

    fixture.detectChanges(); // Inicia o OnInit

    expect(component.textoSaudacao).toEqual('Bom Dia!');
  });

  it('deve exibir "Boa Tarde!" se a hora for entre 12h e 17h', () => {
    const baseTime = new Date(2026, 5, 11, 15, 0, 0); // Mock 15:00 PM
    vi.useFakeTimers();
    vi.setSystemTime(baseTime);

    fixture.detectChanges();

    expect(component.textoSaudacao).toEqual('Boa Tarde!');
  });

  it('deve exibir "Boa Noite!" se a hora for entre 18h e 23h', () => {
    const baseTime = new Date(2026, 5, 11, 20, 0, 0); // Mock 20:00 PM
    vi.useFakeTimers();
    vi.setSystemTime(baseTime);

    fixture.detectChanges();

    expect(component.textoSaudacao).toEqual('Boa Noite!');
  });

  it('deve exibir "Curtindo a Madrugada?" se a hora for entre 0h e 4h', () => {
    const baseTime = new Date(2026, 5, 11, 2, 0, 0); // Mock 02:00 AM
    vi.useFakeTimers();
    vi.setSystemTime(baseTime);

    fixture.detectChanges();

    expect(component.textoSaudacao).toEqual('Curtindo a Madrugada?');
  });

  // ----------------------------------------------------------------------------------
  // 4. TESTES DA LÓGICA DE SLIDES DISPONÍVEIS (availableSlides)
  // ----------------------------------------------------------------------------------
  it('deve incluir apenas o slide 0 (Demográfico) se não houver música nem minutos', () => {
    component.ultimaMusica = null;
    component.minutosOuvidosHoje = 0;
    
    const slides = component['availableSlides']; 
    
    expect(slides.length).toBe(1);
    expect(slides).toEqual([0]);
  });

  it('deve incluir os slides 0 e 1 se houver última música, mas 0 minutos ouvidos', () => {
    component.ultimaMusica = { nome: 'Música Teste', artista: 'Artista Teste' };
    component.minutosOuvidosHoje = 0;
    
    const slides = component['availableSlides'];
    
    expect(slides.length).toBe(2);
    expect(slides).toEqual([0, 1]); 
  });

  it('deve incluir os slides 0 e 2 se NÃO houver música, mas tiver > 0 minutos ouvidos', () => {
    component.ultimaMusica = null;
    component.minutosOuvidosHoje = 15;
    
    const slides = component['availableSlides'];
    
    expect(slides.length).toBe(2);
    expect(slides).toEqual([0, 2]);
  });

  it('deve incluir todos os slides (0, 1, 2) disponíveis se houver música e minutos validos', () => {
    component.ultimaMusica = { nome: 'Outra Música', artista: 'Banda Teste' };
    component.minutosOuvidosHoje = 150;
    
    const slides = component['availableSlides'];
    
    expect(slides.length).toBe(3);
    expect(slides).toEqual([0, 1, 2]);
  });

  // ----------------------------------------------------------------------------------
  // 5. TESTES DO EVENTO DE HOVER DO MOUSE
  // ----------------------------------------------------------------------------------
  it('deve pausar o carrossel marcando isHovered = true ao disparar pausarCarrossel()', () => {
    component.pausarCarrossel();
    expect(component['isHovered']).toBe(true);
  });

  it('deve retomar o carrossel marcando isHovered = false ao disparar retomarCarrossel()', () => {
    component['isHovered'] = true;
    component.retomarCarrossel();
    expect(component['isHovered']).toBe(false);
  });

  // ----------------------------------------------------------------------------------
  // 6. TESTES DO NG_ON_DESTROY (Ciclo de Vida)
  // ----------------------------------------------------------------------------------
  it('deve limpar o intervalo com clearInterval no ngOnDestroy', () => {
    // Definimos um valor fictício pro intervalo
    component['carrosselInterval'] = setInterval(() => {}, 1000) as any;
    
    // Com Vitest, usamos vi.spyOn para espiar funções globais
    const spy = vi.spyOn(window, 'clearInterval');

    component.ngOnDestroy();

    expect(spy).toHaveBeenCalledWith(component['carrosselInterval']);
  });

});
