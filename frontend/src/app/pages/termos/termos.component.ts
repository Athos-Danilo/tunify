import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-termos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="legal-page-container">
      <div class="legal-content animacao-fade-in">
        
        <header class="legal-header">
          <a routerLink="/" class="btn-voltar">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Voltar para o Tunify
          </a>
          <h1 class="legal-title">Termos de Uso</h1>
          <p class="legal-date">Última atualização: Março de 2026</p>
        </header>

        <div class="legal-body">
          <p>Ao acessar e utilizar o aplicativo Tunify ("Serviço"), você concorda em cumprir e ficar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar o Serviço.</p>

          <h2>1. Isenção de Afiliação (Independência do Serviço)</h2>
          <p>O Tunify é um aplicativo de terceiros desenvolvido de forma independente. <strong>O TUNIFY NÃO É AFILIADO, ENDOSSADO, PATROCINADO OU CERTIFICADO OFICIALMENTE PELA SPOTIFY AB OU QUALQUER UMA DE SUAS SUBSIDIÁRIAS.</strong> Todas as marcas registradas, logotipos e nomes de marcas do Spotify pertencem à Spotify AB.</p>

          <h2>2. Proposta de Valor e Natureza do Serviço</h2>
          <p>O Tunify não é um substituto para o aplicativo oficial do Spotify. Nosso Serviço oferece valor independente ao aplicar análise de dados, métricas de áudio (BPM, valência, energia) e ferramentas de curadoria avançada que não estão disponíveis no player padrão. O Serviço deve ser usado em conjunto com uma conta ativa do Spotify.</p>

          <h2>3. Propriedade Intelectual, Direitos Autorais e Pirataria</h2>
          <p>O Tunify respeita rigorosamente os direitos autorais dos artistas e as Diretrizes para Desenvolvedores do Spotify.</p>
          <ul>
            <li><strong>Nenhuma Pirataria:</strong> O Serviço <strong>NÃO</strong> permite, facilita ou oferece qualquer mecanismo para baixar (download), extrair ("rip"), salvar localmente ou realizar cópias em cache de faixas de áudio, capas de álbuns ou metadados fornecidos pelo Spotify.</li>
            <li>Todo o conteúdo musical exibido, reproduzido ou referenciado no Tunify é transmitido diretamente dos servidores da API do Spotify e está sujeito aos Termos de Serviço do próprio Spotify.</li>
          </ul>

          <h2>4. Responsabilidades do Usuário</h2>
          <p>Ao usar o Tunify, você concorda em:</p>
          <ul>
            <li>Não utilizar o Serviço para fins ilegais ou não autorizados.</li>
            <li>Não tentar realizar engenharia reversa, hackear ou burlar os limites da API do Tunify ou do Spotify.</li>
            <li>Entender que o funcionamento do Tunify depende da disponibilidade da API do Spotify. Se o Spotify alterar suas regras ou suspender a API, o Tunify poderá sofrer interrupções temporárias ou permanentes.</li>
          </ul>

          <h2>5. Limitação de Responsabilidade</h2>
          <p>O Tunify é fornecido "no estado em que se encontra" (as is) e "conforme disponível". Embora utilizemos algoritmos e ciência de dados avançados, não garantimos que o "Flow" criado corresponderá perfeitamente ao gosto subjetivo de cada usuário em 100% do tempo. O Tunify e seus desenvolvedores não serão responsáveis por quaisquer danos diretos, indiretos ou incidentais resultantes do uso ou da incapacidade de usar o Serviço.</p>

          <h2>6. Contato</h2>
          <p>Para dúvidas relacionadas a estes Termos de Uso, comportamento do aplicativo ou questões legais, entre em contato conosco em: suporte&#64;tunify.com.</p>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .legal-page-container {
      min-height: 100vh;
      width: 100%;
      box-sizing: border-box;
      background-color: var(--azul-bg-escuro, #0b1120);
      display: flex;
      justify-content: center;
      padding: 2rem 1rem;
    }

    .legal-content {
      width: 100%;
      max-width: 800px;
      box-sizing: border-box;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      padding: 1.5rem;
      backdrop-filter: blur(10px);
      color: var(--branco-dk, #ffffff);
      font-family: var(--fonte-principal, sans-serif);
    }

    .legal-header {
      margin-bottom: 2rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 1.5rem;
    }

    .btn-voltar {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--azul-dk, #0285ff);
      text-decoration: none;
      font-weight: 600;
      margin-bottom: 1.5rem;
      transition: transform 0.2s ease;
      cursor: pointer;
    }

    .btn-voltar:hover {
      transform: translateX(-5px);
    }

    .btn-voltar svg {
      width: 20px;
      height: 20px;
    }

    .legal-title {
      font-size: 2rem;
      font-weight: 800;
      margin: 0 0 0.5rem 0;
      letter-spacing: -0.5px;
      line-height: 1.1;
    }

    .legal-date {
      color: var(--cinza-claro-dk, #a0aabf);
      font-size: 0.85rem;
      margin: 0;
    }

    .legal-body p, .legal-body li {
      font-size: 1rem;
      line-height: 1.6;
      color: var(--branco-azulado-dk, #c4d2eb);
      margin-bottom: 1rem;
    }

    .legal-body h2 {
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--branco-dk, #ffffff);
      margin: 2rem 0 1rem 0;
    }

    .legal-body ul, .legal-body ol {
      margin-bottom: 1.2rem;
      padding-left: 1.2rem;
    }

    .legal-body strong {
      color: var(--verde-spotify-dk, #1db954);
    }

    .animacao-fade-in {
      animation: surgirDeBaixo 0.6s ease-out forwards;
    }

    @keyframes surgirDeBaixo {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    /* --- RESPONSIVIDADE SÊNIOR (Tablet e Desktop) --- */
    @media (min-width: 768px) {
      .legal-page-container {
        padding: 4rem 2rem;
      }
      .legal-content {
        padding: 3rem;
      }
      .legal-title {
        font-size: 2.8rem;
      }
      .legal-body p, .legal-body li {
        font-size: 1.05rem;
      }
      .legal-body h2 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class TermosComponent {}