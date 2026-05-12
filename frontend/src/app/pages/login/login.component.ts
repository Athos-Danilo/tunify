import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // 🚨 Router adicionado
import { FormsModule } from '@angular/forms'; // 🚨 NOVO: Para capturar os inputs
import { LogoComponent } from '../../components/logo.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LogoComponent], // 🚨 FormsModule adicionado
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  
  modoEscuro = true;

  // 🚨 Variáveis do Formulário
  email = '';
  senha = '';
  carregando = false;
  mensagemErro = '';

  constructor(private router: Router) {}

  ngOnInit() {
    const temaSalvo = localStorage.getItem('tunify_tema');
    if (temaSalvo === 'claro') {
      this.modoEscuro = false;
    }
  }

  // 🚨 A Função do Botão
  entrarNoSistema() {
    // 1. Limpa erros antigos e trava o botão
    this.mensagemErro = '';
    
    if (!this.email || !this.senha) {
      this.mensagemErro = 'Preencha todos os campos, boy!';
      return;
    }

    this.carregando = true;

    // 2. Aqui a gente vai chamar o seu AuthService depois!
    console.log('Tentando logar com:', this.email, this.senha);
    
    // Simulação rápida só pra gente ver o botão funcionando (depois trocamos pela API real)
    setTimeout(() => {
      this.carregando = false;
      // this.router.navigate(['/dashboard']);
      this.mensagemErro = 'A API do backend ainda não está conectada kkkk!';
    }, 1500);
  }
}