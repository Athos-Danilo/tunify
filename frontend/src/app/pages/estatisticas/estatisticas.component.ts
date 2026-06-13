import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import gsap from 'gsap';

@Component({
  selector: 'app-estatisticas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './estatisticas.component.html',
  styleUrls: ['./estatisticas.component.scss']
})
export class EstatisticasComponent implements OnInit, AfterViewInit {
  // GSAP References
  @ViewChild('header') header!: ElementRef;
  @ViewChild('heroTitle') heroTitle!: ElementRef;
  @ViewChild('heroText1') heroText1!: ElementRef;
  @ViewChild('heroText2') heroText2!: ElementRef;
  @ViewChild('chartSection') chartSection!: ElementRef;
  @ViewChildren('bar') bars!: QueryList<ElementRef>;
  @ViewChild('totalMinutosSpan') totalMinutosSpan!: ElementRef;

  // Data
  mesAtual: string = 'junho 2026';
  totalMinutos: number = 3294; // Target value
  mediaDiaria: number = 274;

  // Mock days: 30 days of random minutes, specifically shaping exactly like the user's screenshot
  diasNoMes: number[] = [
    250, 120, 230, 260, 140, 190, 210, 280, // week 1
    110, 160, 518, 340, 180, 190, 0, 0, // week 2
    0, 0, 0, 0, 0, 0, 0, 0, // week 3
    0, 0, 0, 0, 0, 0 // week 4
  ];

  // Helper for max value in chart
  maxMinutos: number = 518;

  constructor() {}

  ngOnInit() {
    // Generate dates or month string based on current date if needed.
    // For now we use the mock data to match the visual perfectly.
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.iniciarAnimacoesGSAP();
    }, 100); // Aguarda o Angular renderizar o *ngFor completamente
  }

  iniciarAnimacoesGSAP() {
    // Timeline to orchestrate everything
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 1. Header fade in
    tl.from(this.header.nativeElement, {
      y: -20,
      opacity: 0,
      duration: 0.8
    })
    
    // 2. Hero Text stagger fade in
    .from([this.heroTitle.nativeElement, this.heroText1.nativeElement, this.heroText2.nativeElement], {
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15
    }, "-=0.4")

    // 3. Chart Section fade in
    .from(this.chartSection.nativeElement, {
      opacity: 0,
      y: 20,
      duration: 0.8
    }, "-=0.4");

    // 4. Animar o número do total de minutos (0 até totalMinutos)
    const obj = { value: 0 };
    tl.to(obj, {
      value: this.totalMinutos,
      duration: 2.5, // 2.5 seconds to count
      ease: 'power2.out',
      onUpdate: () => {
        if (this.totalMinutosSpan) {
          // Format number with dots (e.g. 3.294)
          this.totalMinutosSpan.nativeElement.innerText = Math.round(obj.value).toLocaleString('pt-BR');
        }
      }
    }, "-=0.6");

    // 5. Crescer as barras do gráfico (Stagger)
    const barsElements = gsap.utils.toArray('.bar-fill');
    if (barsElements.length > 0) {
      tl.from(barsElements, {
        height: 0,
        duration: 1,
        ease: 'back.out(1.2)', // Pequeno efeito de elástico ao subir
        stagger: 0.03
      }, "-=2.2"); // Starts together with the number counting
    }
  }

  // Calcula a altura da barra baseada no valor máximo para não estourar o container
  getBarHeight(valor: number): string {
    if (valor === 0) return '2px'; // show a tiny dot for zero
    const percent = (valor / this.maxMinutos) * 100;
    return `${percent}%`;
  }
}
