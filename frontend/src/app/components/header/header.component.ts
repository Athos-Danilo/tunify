import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LogoComponent } from '../logo.component'; // Ajuste o caminho se necessário!

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LogoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  // Recebe os dados lá do Dashboard
  @Input() nomeUsuario: string | null = '';
  @Input() fotoPerfil: string = '';
  @Input() modoEscuro: boolean = true;

  // Avisa o Dashboard quando o usuário clicar nos botões
  @Output() onAlternarTema = new EventEmitter<void>();
  @Output() onLogout = new EventEmitter<void>();

  alternarTema() {
    this.onAlternarTema.emit();
  }

  fazerLogout() {
    this.onLogout.emit();
  }

  // Pega só o primeiro nome para não quebrar o layout
  get primeiroNome(): string {
    return this.nomeUsuario ? this.nomeUsuario.split(' ')[0] : 'Usuário';
  }
}