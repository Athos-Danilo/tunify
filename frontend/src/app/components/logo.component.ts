import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tunify-logo-wrap">
      <svg class="tunify-icon" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect class="bar bar1" [class.animado]="animado" x="0" y="15" width="6" height="20" rx="3" fill="#0285ff"/>
        <rect class="bar bar2" [class.animado]="animado" x="11" y="5" width="6" height="40" rx="3" fill="#0285ff"/>
        <rect class="bar bar3" [class.animado]="animado" x="22" y="0" width="6" height="50" rx="3" fill="#0285ff"/>
        <rect class="bar bar4" [class.animado]="animado" x="33" y="5" width="6" height="40" rx="3" fill="#0285ff"/>
        <rect class="bar bar5" [class.animado]="animado" x="44" y="15" width="6" height="20" rx="3" fill="#0285ff"/>
      </svg>
      <span class="tunify-text">Tunify</span>
    </div>
  `,
  styles: [`
    .tunify-logo-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      user-select: none;
    }

    /* --- RESPONSIVIDADE AUTOMÁTICA --- */
    .tunify-icon {
      width: 34px; /* Tamanho Mobile */
      height: auto;
      overflow: visible;
      transition: width 0.3s ease;
    }
    
    .tunify-text {
      font-family: var(--fonte-principal, sans-serif);
      font-weight: 700;
      color: #0285ff; /* 🚨 Azul cravado eternamente */
      letter-spacing: -0.5px;
      font-size: 2rem; /* Tamanho Mobile */
      transition: font-size 0.3s ease;
    }

    /* Tablet */
    @media (min-width: 768px) {
      .tunify-icon { width: 45px; }
      .tunify-text { font-size: 2.5rem; }
    }
    
    /* Desktop */
    @media (min-width: 1024px) {
      .tunify-icon { width: 50px; }
      .tunify-text { font-size: 3rem; }
    }

    /* --- ANIMAÇÃO ORGÂNICA (WAVEFORM) --- */
    .bar {
      transform-origin: center;
      transition: transform 0.3s ease;
    }

    /* Cada barra ganha um tempo de duração MAIOR para ficar suave e premium */
    .bar1.animado { animation: wave1 2.2s ease-in-out infinite; }
    .bar2.animado { animation: wave2 1.8s ease-in-out infinite; }
    .bar3.animado { animation: wave3 2.1s ease-in-out infinite; }
    .bar4.animado { animation: wave4 2.5s ease-in-out infinite; }
    .bar5.animado { animation: wave5 1.9s ease-in-out infinite; }

    /* Keyframes independentes para cada barra */
    @keyframes wave1 { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.4); } }
    @keyframes wave2 { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.6); } }
    @keyframes wave3 { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.3); } }
    @keyframes wave4 { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.7); } }
    @keyframes wave5 { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.2); } }
  `]
})
export class LogoComponent {
  // O componente agora só precisa saber se deve animar ou não
  @Input() animado: boolean = true;
}