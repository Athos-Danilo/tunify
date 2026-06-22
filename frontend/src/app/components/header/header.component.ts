import { Component, Input, Output, EventEmitter, HostListener, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LogoComponent } from '../logo.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LogoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  static preloaderFinalizado = false;

  @Input() nomeUsuario: string | null = '';
  @Input() fotoPerfil: string = '';
  @Input() modoEscuro: boolean = true;

  @Output() onAlternarTema = new EventEmitter<void>();
  @Output() onLogout = new EventEmitter<void>();

  isScrolled = false;

  // 🚨 NOVA VARIÁVEL: Controla se a barra de pesquisa do celular está aberta
  isSearchMobileOpen = false;
  isMobileMenuOpen = false;
  isPreloaderActive = true;

  dataAtual: string = '';

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const hoje = new Date();
    // Ex: "sex., 28 de junho de 2024"
    let formatador = new Intl.DateTimeFormat('pt-BR', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    this.dataAtual = formatador.format(hoje).replace('.', '').replace(/ de /g, ' de ');

    if (HeaderComponent.preloaderFinalizado) {
      this.isPreloaderActive = false;
    } else {
      setTimeout(() => {
        HeaderComponent.preloaderFinalizado = true;
        this.isPreloaderActive = false;
        this.cdr.detectChanges();
      }, 5400); // 5.4 segundos (coincide com o fade-out do preloader de 6s)
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Se passar de 20px de descida, ativa o modo compacto!
    this.isScrolled = window.scrollY > 20; 
  }

  // 🚨 FUNÇÕES PARA ABRIR/FECHAR A PESQUISA E O MENU MOBILE
  abrirPesquisaMobile() { this.isSearchMobileOpen = true; }
  fecharPesquisaMobile() { this.isSearchMobileOpen = false; }
  
  toggleMobileMenu() { this.isMobileMenuOpen = !this.isMobileMenuOpen; }

  alternarTema() { this.onAlternarTema.emit(); }
  fazerLogout() { this.onLogout.emit(); }

  rolarParaOTopo() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  get primeiroNome(): string {
    return this.nomeUsuario ? this.nomeUsuario.split(' ')[0] : 'Usuário';
  }
}