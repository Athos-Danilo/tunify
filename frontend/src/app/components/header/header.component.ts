import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
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
export class HeaderComponent {
  @Input() nomeUsuario: string | null = '';
  @Input() fotoPerfil: string = '';
  @Input() modoEscuro: boolean = true;

  @Output() onAlternarTema = new EventEmitter<void>();
  @Output() onLogout = new EventEmitter<void>();

  isScrolled = false;

  // 🚨 NOVA VARIÁVEL: Controla se a barra de pesquisa do celular está aberta
  isSearchMobileOpen = false;
  isMobileMenuOpen = false;

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

  get primeiroNome(): string {
    return this.nomeUsuario ? this.nomeUsuario.split(' ')[0] : 'Usuário';
  }
}