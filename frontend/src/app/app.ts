import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // Precisamos disso para mudar as cores do texto

declare var FinisherHeader: any;

// 2. Crie uma interface simples para os números flutuantes
interface SkipsContados {
  id: number; // Identificador único pra gente poder remover depois
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App implements OnInit, AfterViewInit {            
  title = 'Tunify';
  modoEscuro = true;
  animarTextos = false;

  // 4. Variáveis da simulação de frustração
  skips: SkipsContados[] = []; // A lista que vai guardar os "+1" da tela
  totalSkips = 0; // O contador interno
  btnSkipActive = false; // Controla se o botão está piscando

  // 2. Pega a div principal lá do HTML para podermos limpar o canvas antigo
  @ViewChild('headerContainer') headerContainer!: ElementRef;

  // 2. Injete o "despertador" aqui
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // 5. Dá o play na simulação assim que o app nasce
    this.iniciarSimulacaoSkips();
  }

  ngAfterViewInit() {
    this.renderizarFundo(); 

    setTimeout(() => {
      this.animarTextos = true;
      this.cdr.detectChanges(); 
    }, 5000);
  }

  // --- O MOTOR DA FRUSTRAÇÃO (MUUUITO MAIS SUAVE) ---
  iniciarSimulacaoSkips() {
    // Loop principal: um novo clique a cada 3 segundos
    setInterval(() => {
      
      this.btnSkipActive = true; 
      this.cdr.detectChanges();

      // 1. O botão fica "afundado" por 400ms (dobro do tempo)
      setTimeout(() => { 
        this.btnSkipActive = false; 
        
        this.totalSkips++; 
        const novoSkip: SkipsContados = { id: this.totalSkips };
        this.skips.push(novoSkip); 
        this.cdr.detectChanges();

        // 2. O número flutua calmamente por 2.5 segundos (2500ms) antes de sumir
        setTimeout(() => {
          this.removerSkip(novoSkip.id);
        }, 2500);

      }, 400); // <-- Aqui mudamos para 400ms

    }, 3000); // <-- Aqui mudamos para 3000ms
  }

  removerSkip(id: number) {
    // Filtra a lista e mantém só os skips que NÃO têm esse ID
    this.skips = this.skips.filter(s => s.id !== id);
    this.cdr.detectChanges(); // Atualiza a tela sem o número
  }

  alternarTema() {
    this.modoEscuro = !this.modoEscuro; 
    this.renderizarFundo();
  }

  renderizarFundo() {
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