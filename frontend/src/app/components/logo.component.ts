import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tunify-logo-wrap" 
         [ngClass]="'tamanho-' + tamanho" 
         [class.is-animado]="animado">
         
      <svg class="tunify-icon" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect class="bar bar1" x="0" y="15" width="6" height="20" rx="3" fill="#0285FF"/>
        <rect class="bar bar2" x="11" y="5" width="6" height="40" rx="3" fill="#0285FF"/>
        <rect class="bar bar3" x="22" y="0" width="6" height="50" rx="3" fill="#0285FF"/>
        <rect class="bar bar4" x="33" y="5" width="6" height="40" rx="3" fill="#0285FF"/>
        <rect class="bar bar5" x="44" y="15" width="6" height="20" rx="3" fill="#0285FF"/>
      </svg>
      
      <span class="tunify-text">Tunify</span>
    </div>
  `,
  styles: [`
    .tunify-logo-wrap {
      display: flex;
      align-items: center;
      gap: 0.3em; 
      user-select: none;
    }

    .tunify-icon {
      height: auto;
      overflow: visible;
      transition: width 0.3s ease;
    }
    
    .tunify-text {
      font-family: var(--fonte-especial, sans-serif);
      font-weight: 700;
      color: #0285FF; 
      letter-spacing: -0.5px;
      line-height: 1; 
      transition: font-size 0.3s ease;
    }

    /*----- SISTEMA DE ESCALAS -----*/
    
    /*--- CELULAR ---*/
    .tamanho-pequeno .tunify-icon { width: 20px; }
    .tamanho-pequeno .tunify-text { font-size: 1.2rem; }

    .tamanho-medio .tunify-icon { width: 28px; }
    .tamanho-medio .tunify-text { font-size: 1.6rem; }

    .tamanho-grande .tunify-icon { width: 36px; }
    .tamanho-grande .tunify-text { font-size: 2.0rem; }

    .tamanho-gigante .tunify-icon { width: 45px; }
    .tamanho-gigante .tunify-text { font-size: 2.5rem; }

    /*--- TABLET ---*/
    @media (min-width: 900px) {
      .tamanho-pequeno .tunify-icon { width: 24px; }
      .tamanho-pequeno .tunify-text { font-size: 1.4rem; }

      .tamanho-medio .tunify-icon { width: 34px; }
      .tamanho-medio .tunify-text { font-size: 2.0rem; }

      .tamanho-grande .tunify-icon { width: 45px; }
      .tamanho-grande .tunify-text { font-size: 2.5rem; }

      .tamanho-gigante .tunify-icon { width: 60px; }
      .tamanho-gigante .tunify-text { font-size: 3.5rem; }
    }

    /*--- TELAS GRANDES ---*/
    @media (min-width: 1400px) {
      .tamanho-pequeno .tunify-icon { width: 28px; }
      .tamanho-pequeno .tunify-text { font-size: 1.6rem; }

      .tamanho-medio .tunify-icon { width: 40px; }
      .tamanho-medio .tunify-text { font-size: 2.4rem; }

      .tamanho-grande .tunify-icon { width: 55px; }
      .tamanho-grande .tunify-text { font-size: 3.0rem; }

      /* O modo IMAX do seu logo! */
      .tamanho-gigante .tunify-icon { width: 75px; }
      .tamanho-gigante .tunify-text { font-size: 4.5rem; }
    }

    /*--- ANIMAÇÃO ---*/
    .bar {
      transform-origin: center;
      transition: transform 0.3s ease;
    }

    .is-animado .bar1 { animation: wave1 2.2s ease-in-out infinite; }
    .is-animado .bar2 { animation: wave2 1.8s ease-in-out infinite; }
    .is-animado .bar3 { animation: wave3 2.1s ease-in-out infinite; }
    .is-animado .bar4 { animation: wave4 2.5s ease-in-out infinite; }
    .is-animado .bar5 { animation: wave5 1.9s ease-in-out infinite; }

    /* Keyframes independentes */
    @keyframes wave1 { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.4); } }
    @keyframes wave2 { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.6); } }
    @keyframes wave3 { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.3); } }
    @keyframes wave4 { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.7); } }
    @keyframes wave5 { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.2); } }
  `]
})
export class LogoComponent {
  // Controle se é animado ou estático. 
  @Input() animado: boolean = true;

  @Input() tamanho: 'pequeno' | 'medio' | 'grande' | 'gigante' = 'medio';
}