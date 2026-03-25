import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // 🚨 Necessário para os inputs e o checkbox

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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
          <h1 class="legal-title">Transmissão Direta</h1>
          <p class="legal-date">Comunicação oficial com a engenharia do Tunify</p>
        </header>

        <div class="legal-body">
          <p class="intro-text">
            Este é o seu canal direto com os desenvolvedores e curadores do algoritmo. 
            Seja para reportar um erro bizarro, sugerir uma funcionalidade ou apenas nos contar como o Tunify salvou sua playlist, nós queremos ouvir a sua frequência.
          </p>

          <form class="contato-form" (ngSubmit)="enviarMensagem($event)">
            
            <div class="form-group">
              <label class="form-label">Qual é o tipo da transmissão?</label>
              <div class="chips-container">
                <button type="button" class="chip" [class.ativo]="tipoMensagem === 'bug'" (click)="tipoMensagem = 'bug'">👾 Anomalia na Matrix</button>
                <button type="button" class="chip" [class.ativo]="tipoMensagem === 'ideia'" (click)="tipoMensagem = 'ideia'">💡 Ideia Brilhante</button>
                <button type="button" class="chip" [class.ativo]="tipoMensagem === 'elogio'" (click)="tipoMensagem = 'elogio'">🔥 Frequência Positiva</button>
                <button type="button" class="chip" [class.ativo]="tipoMensagem === 'critica'" (click)="tipoMensagem = 'critica'">🛠️ Ajuste de Rota</button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="assunto">Título da Mensagem</label>
              <input type="text" id="assunto" class="form-input" placeholder="Ex: O algoritmo ignorou meu rock anos 80..." required>
            </div>

            <div class="form-group">
              <label class="form-label" for="mensagem">Detalhes da Transmissão</label>
              <textarea id="mensagem" class="form-input" rows="5" placeholder="Descreva os detalhes do que aconteceu ou do que você imaginou..." required></textarea>
            </div>

            <div class="form-group checkbox-group">
              <label class="custom-checkbox">
                <input type="checkbox" [(ngModel)]="querRetorno" name="querRetorno">
                <span class="checkmark"></span>
                <span class="checkbox-text">Gostaria de receber um retorno da equipe sobre isso.</span>
              </label>
            </div>

            <div class="form-group animacao-slide-down" *ngIf="querRetorno">
              <label class="form-label" for="email">E-mail para contato</label>
              <input type="email" id="email" class="form-input" placeholder="seu.melhor@email.com" [required]="querRetorno">
            </div>

            <button type="submit" class="btn-enviar">Transmitir Sinal</button>
          </form>
        </div>

      </div>

      <div class="popup-overlay" *ngIf="mostrarPopup" (click)="fecharPopup()">
        <div class="popup-content animacao-zoom-in" (click)="$event.stopPropagation()">
          <div class="popup-icon">🚀</div>
          <h2 class="popup-titulo">Transmissão Concluída!</h2>
          <p class="popup-texto">Nossos servidores já receberam o seu sinal. Vamos ler sua mensagem com calma e, se você solicitou um retorno, logo entraremos na sua frequência (via e-mail).</p>
          <button class="btn-fechar-popup" (click)="fecharPopup()">Voltar ao QG</button>
        </div>
      </div>

    </div>
  `,
  styles: [`
    /* --- Base Herdada das Páginas Legais --- */
    .legal-page-container {
      min-height: 100vh;
      width: 100%;
      box-sizing: border-box;
      background-color: var(--azul-bg-escuro, #0b1120);
      display: flex;
      justify-content: center;
      padding: 2rem 1rem;
      position: relative;
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

    .btn-voltar:hover { transform: translateX(-5px); }
    .btn-voltar svg { width: 20px; height: 20px; }

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

    .intro-text {
      font-size: 1.05rem;
      line-height: 1.6;
      color: var(--branco-azulado-dk, #c4d2eb);
      margin-bottom: 2.5rem;
    }

    /* --- ESTILOS DO FORMULÁRIO --- */
    .contato-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-label {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--branco-dk, #ffffff);
    }

    /* Os Inputs Tecnológicos */
    .form-input {
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 12px 15px;
      color: var(--branco-dk, #ffffff);
      font-family: var(--fonte-principal, sans-serif);
      font-size: 1rem;
      transition: all 0.3s ease;
      outline: none;
    }

    .form-input::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }

    .form-input:focus {
      border-color: var(--azul-dk, #0285ff);
      box-shadow: 0 0 0 3px rgba(2, 133, 255, 0.2);
      background: rgba(0, 0, 0, 0.3);
    }

    /* Os Chips de Categoria */
    .chips-container {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .chip {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 50px;
      padding: 8px 16px;
      color: var(--cinza-claro-dk, #a0aabf);
      font-family: var(--fonte-principal, sans-serif);
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .chip:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--branco-dk, #ffffff);
    }

    .chip.ativo {
      background: var(--azul-dk, #0285ff);
      border-color: var(--azul-dk, #0285ff);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(2, 133, 255, 0.3);
    }

    /* O Botão de Enviar */
    .btn-enviar {
      background: var(--verde-spotify-dk, #1db954);
      color: #ffffff;
      border: none;
      border-radius: 10px;
      padding: 15px;
      font-size: 1.1rem;
      font-weight: 700;
      font-family: var(--fonte-principal, sans-serif);
      cursor: pointer;
      margin-top: 1rem;
      transition: transform 0.2s ease, background 0.2s ease;
    }

    .btn-enviar:hover {
      background: #1ed760;
      transform: translateY(-2px);
    }

    /* Checkbox Customizado */
    .checkbox-group {
      margin-top: 0.5rem;
    }

    .custom-checkbox {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      font-size: 0.95rem;
      color: var(--branco-azulado-dk, #c4d2eb);
      user-select: none;
    }

    .custom-checkbox input {
      display: none; /* Esconde o padrão feio do HTML */
    }

    .checkmark {
      width: 20px;
      height: 20px;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .custom-checkbox input:checked ~ .checkmark {
      background: var(--azul-dk, #0285ff);
      border-color: var(--azul-dk, #0285ff);
    }

    .custom-checkbox input:checked ~ .checkmark::after {
      content: '✓';
      color: white;
      font-size: 14px;
      font-weight: bold;
    }

    /* --- ESTILOS DO POPUP MODAL --- */
    .popup-overlay {
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }

    .popup-content {
      background: var(--azul-bg-escuro, #0b1120);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 2.5rem;
      max-width: 450px;
      text-align: center;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    }

    .popup-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .popup-titulo {
      font-size: 1.8rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 1rem 0;
    }

    .popup-texto {
      font-size: 1rem;
      line-height: 1.6;
      color: var(--branco-azulado-dk, #c4d2eb);
      margin-bottom: 2rem;
    }

    .btn-fechar-popup {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50px;
      padding: 12px 30px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-fechar-popup:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    /* --- ANIMAÇÕES --- */
    .animacao-fade-in { animation: surgirDeBaixo 0.6s ease-out forwards; }
    .animacao-slide-down { animation: slideDown 0.3s ease-out forwards; }
    .animacao-zoom-in { animation: zoomIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

    @keyframes surgirDeBaixo {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideDown {
      0% { opacity: 0; transform: translateY(-10px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes zoomIn {
      0% { opacity: 0; transform: scale(0.8); }
      100% { opacity: 1; transform: scale(1); }
    }

    /* Responsividade */
    @media (min-width: 768px) {
      .legal-page-container { padding: 4rem 2rem; }
      .legal-content { padding: 3rem; }
      .legal-title { font-size: 2.8rem; }
    }
  `]
})
export class ContatoComponent {
  // Lógica de estado do formulário
  tipoMensagem: string = 'ideia'; // Começa com 'ideia' selecionado por padrão
  querRetorno: boolean = false;
  mostrarPopup: boolean = false;

  enviarMensagem(event: Event) {
    event.preventDefault(); // Impede a página de recarregar
    // Aqui no futuro você conectaria com o backend para enviar o e-mail de verdade!
    
    this.mostrarPopup = true; // Mostra a mensagem de sucesso
  }

  fecharPopup() {
    this.mostrarPopup = false;
    
    // Reseta o formulário após enviar (Opcional, mas é uma boa prática Sênior)
    this.tipoMensagem = 'ideia';
    this.querRetorno = false;
    // (Para limpar os inputs de texto, o ideal seria usar Reactive Forms no futuro, mas assim já funciona a UX visual!)
  }
}