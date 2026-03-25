import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Necessário para o botão de voltar

@Component({
  selector: 'app-privacidade',
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
          <h1 class="legal-title">Política de Privacidade</h1>
          <p class="legal-date">Última atualização: Março de 2026</p>
        </header>

        <div class="legal-body">
          <p>Bem-vindo ao Tunify. A sua privacidade é a nossa prioridade. Esta Política de Privacidade explica como coletamos, usamos, processamos e protegemos suas informações quando você utiliza o aplicativo web Tunify ("Serviço"). Ao utilizar o Tunify, você concorda com as práticas descritas neste documento.</p>

          <h2>1. O que é o Tunify e como nos conectamos ao Spotify</h2>
          <p>O Tunify é uma ferramenta analítica de terceiros projetada para aprimorar a sua experiência musical através de ciência de dados. Para funcionar, o Tunify utiliza a API oficial do Spotify (autenticação via OAuth). <strong>Nós não temos acesso, não solicitamos e não armazenamos a sua senha do Spotify em nenhuma hipótese.</strong></p>

          <h2>2. Dados que Coletamos</h2>
          <p>Para entregar a funcionalidade principal do nosso algoritmo (o "Flow"), solicitamos acesso estritamente aos seguintes escopos da sua conta do Spotify:</p>
          <ul>
            <li><strong>Dados de Perfil Básico:</strong> Seu nome de usuário e foto de perfil (apenas para exibição na interface do Serviço).</li>
            <li><strong>Dados de Reprodução e Histórico:</strong> O que você está ouvindo no momento, seu histórico recente de reproduções e seus "skips" (pulos de faixas).</li>
            <li><strong>Dados de Bibliotecas e Playlists:</strong> Acesso de leitura às suas playlists públicas e privadas para podermos analisar os metadados das faixas (BPM, energia, valência, etc.).</li>
          </ul>

          <h2>3. Como Usamos os Seus Dados</h2>
          <p>O Tunify segue o princípio da coleta mínima. Utilizamos seus dados exclusivamente para:</p>
          <ul>
            <li>Analisar os metadados de áudio e gerar estatísticas visuais (como o gráfico de Flow e Caos).</li>
            <li>Identificar padrões de pulos (skips) para otimizar a sua jornada sonora.</li>
            <li>Processar informações em tempo real ("on the fly") para manter a interface atualizada de acordo com o seu player.</li>
          </ul>

          <h2>4. Armazenamento e Compartilhamento de Dados</h2>
          <p>O Tunify processa a esmagadora maioria dos dados em tempo real. <strong>Nós não construímos bancos de dados massivos com o seu histórico musical e não armazenamos suas informações pessoais sensíveis.</strong></p>
          <ul>
            <li><strong>NÃO vendemos</strong> seus dados para anunciantes ou corretores de dados.</li>
            <li><strong>NÃO compartilhamos</strong> suas informações com terceiros, exceto quando exigido por lei.</li>
            <li>Os tokens de acesso do Spotify são armazenados de forma segura e local (no seu navegador) e/ou em sessões temporárias encriptadas no nosso servidor.</li>
          </ul>

          <h2>5. Revogação de Acesso e Exclusão de Dados</h2>
          <p>Você tem controle total sobre os seus dados. Se desejar parar de usar o Tunify e revogar o nosso acesso à sua conta do Spotify, você pode fazê-lo a qualquer momento de forma simples:</p>
          <ol>
            <li>Acesse a página da sua conta no site oficial do Spotify.</li>
            <li>Vá até a aba "Aplicativos" (Apps).</li>
            <li>Encontre o "Tunify" na lista e clique em "Remover Acesso".</li>
          </ol>
          <p>Ao fazer isso, o Tunify perderá instantaneamente qualquer permissão de leitura dos seus dados. Para solicitar a exclusão de qualquer dado residual, entre em contato através do e-mail: suporte&#64;tunify.com.</p>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .legal-page-container {
      min-height: 100vh;
      width: 100%;
      box-sizing: border-box; /* 🚨 Segura a largura máxima na tela! */
      background-color: var(--azul-bg-escuro, #0b1120);
      display: flex;
      justify-content: center;
      padding: 2rem 1rem; /* Respiro externo menor no celular */
    }

    .legal-content {
      width: 100%;
      max-width: 800px;
      box-sizing: border-box; /* 🚨 Impede o padding de estourar o card pra fora */
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      padding: 1.5rem; /* Padding interno menor no celular */
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
      font-size: 2rem; /* Fonte um pouco menor no mobile */
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
        padding: 3rem; /* Fica luxuoso no PC */
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
export class PrivacidadeComponent {}