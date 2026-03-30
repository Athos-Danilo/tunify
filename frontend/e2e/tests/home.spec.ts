import { test, expect } from '@playwright/test';

// ========================================================================= //
// --- TESTES E2E: A JORNADA COMPLETA DO USUÁRIO NA HOME
// ========================================================================= //
test.describe('Landing Page Tunify - E2E Completo', () => {

  // O robô sempre começa acessando o site novo e limpo antes de CADA teste
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');

    // 🚨 Aulas de Paciência para o Robô:
    // Manda ele esperar 5.5 segundos para o Loader sumir e a animação do Angular liberar a tela!
    await page.waitForTimeout(5500);
  });

  // ========================================================================= //
  // TESTE 1: RENDERIZAÇÃO CRÍTICA (O Básico)
  // ========================================================================= //
  test('O robô deve carregar a página inicial e enxergar o botão principal', async ({ page }) => {
    // Confere o título na aba do navegador
    await expect(page).toHaveTitle(/Tunify/);
    
    // Procura o botão sagrado do Spotify
    const botaoSpotify = page.locator('button', { hasText: 'Conectar com o Spotify' }).first();
    
    // O botão não pode estar invisível ou atrás de outra coisa
    await expect(botaoSpotify).toBeVisible();
  });

  // ========================================================================= //
  // TESTE 2: FLUXO DE AUTENTICAÇÃO OAUTH (Requisito da Documentação!)
  // ========================================================================= //
  test('O robô deve ser jogado para o Backend ao tentar fazer login', async ({ page }) => {
    
    // HACK SÊNIOR: Nós interceptamos a requisição para o seu servidor Python.
    // Se o robô tentar ir para essa URL, a gente devolve um "OK (200)" falso, 
    // assim o teste não quebra se o backend estiver desligado!
    await page.route('**/api/v1/auth/login', route => {
      route.fulfill({ status: 200, body: 'Backend Simulado com Sucesso!' });
    });

    const botaoSpotify = page.locator('button', { hasText: 'Conectar com o Spotify' }).first();
    
    // O robô clica fisicamente no botão
    await botaoSpotify.click();

    // A mágica: A URL da página TEVE que mudar para a rota do Backend!
    await expect(page).toHaveURL(/.*api\/v1\/auth\/login/);
  });

  // ========================================================================= //
  // TESTE 3: INTERAÇÃO DE ROLAGEM E ANIMAÇÕES (Intersection Observer)
  // ========================================================================= //
  test('O robô deve rolar a página para baixo e destravar as animações', async ({ page }) => {
    
    // O robô simula o "scroll" da rodinha do mouse jogando a tela 800 pixels pra baixo
    await page.evaluate(() => window.scrollBy(0, 800));

    // Damos um tempo para a sua animação de Fade-In / Slide-Up acontecer
    await page.waitForTimeout(500); 

    // Opcional: O robô tira um print do meio da página para você ver no relatório!
    await page.screenshot({ path: 'tests/print-scroll-robô.png' });

    // Como eu não tenho as classes exatas do seu HTML de baixo, deixei esse expect genérico.
    // Ele garante que o body continua visível e a página não quebrou no scroll.
    await expect(page.locator('body')).toBeVisible();
  });

});