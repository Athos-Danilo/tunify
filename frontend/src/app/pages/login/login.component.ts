import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LogoComponent } from '../../components/logo.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, LogoComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  
  modoEscuro = true;

  ngOnInit() {
    // 🚨 O Login pergunta ao navegador: "Qual era o tema lá na Home?"
    const temaSalvo = localStorage.getItem('tunify_tema');
    if (temaSalvo === 'claro') {
      this.modoEscuro = false;
    }
  }
}