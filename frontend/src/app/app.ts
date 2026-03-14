import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // Precisamos disso para mudar as cores do texto

declare var FinisherHeader: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit {            
  title = 'Tunify';
  
  // 1. Nossa variável de controle do Tema
  modoEscuro = true;

  // 2. Pega a div principal lá do HTML para podermos limpar o canvas antigo
  @ViewChild('headerContainer') headerContainer!: ElementRef;

  ngAfterViewInit() {
    this.renderizarFundo(); // Carrega o fundo a primeira vez
  }

  // --- O BOTÃO VAI CHAMAR ESSA FUNÇÃO ---
  alternarTema() {
    this.modoEscuro = !this.modoEscuro; // Inverte o tema (se tá true, vira false e vice-versa)
    this.renderizarFundo();
  }

  renderizarFundo() {
    // A mágica da performance: Procura se já tem um Canvas lá dentro e apaga!
    const container = this.headerContainer.nativeElement;
    const canvasAntigo = container.querySelector('canvas');
    if (canvasAntigo) {
      canvasAntigo.remove();
    }

    // Escolhe qual configuração usar baseado no tema atual
    const config = this.modoEscuro ? this.getConfigDark() : this.getConfigLight();
    
    // Injeta o novo fundo
    new FinisherHeader(config);
  }

  // --- SUAS DUAS CONFIGURAÇÕES PERFEITAS ---
  getConfigDark() {
    return {
      "count": 12,
      "size": { "min": 1000, "max": 1500, "pulse": 1 },
      "speed": {
        "x": { "min": 0.6, "max": 3 },
        "y": { "min": 0.6, "max": 3 }
      },
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

  getConfigLight() {
    return {
      "count": 12,
      "size": { "min": 1000, "max": 1500, "pulse": 0 },
      "speed": {
        "x": { "min": 0.3, "max": 2 },
        "y": { "min": 0.6, "max": 3 }
      },
      "colors": {
        "background": "#FFFFFF",
        "particles": ["#FFFFFF", "#EEEEEE", "#DADADA", "#CFCFCF", "#7e7d7d"]
      },
      "blending": "lighten",
      "opacity": { "center": 0.6, "edge": 0 },
      "skew": 0,
      "shapes": ["c"]
    };
  }

  fazerLogin() {
    window.location.href = 'http://127.0.0.1:8000/api/v1/auth/login';
  }
}