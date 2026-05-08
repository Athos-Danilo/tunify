import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.scss']
})
export class ConfiguracoesComponent implements OnInit {
  novaSenha = '';
  confirmarSenha = '';
  emailUsuario = '';
  
  mensagem = '';
  carregando = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Quando a tela abre, a gente vai na gaveta do navegador ver quem tá logado
    const userInfo = localStorage.getItem('tunify_user_info');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      this.emailUsuario = user.email;
    }
  }

  salvarNovaSenha(): void {
    // Travas de segurança do Frontend
    if (!this.novaSenha || this.novaSenha.length < 6) {
      this.mensagem = 'A senha precisa ter pelo menos 6 caracteres.';
      return;
    }
    if (this.novaSenha !== this.confirmarSenha) {
      this.mensagem = 'As senhas não coincidem. Digite novamente!';
      return;
    }
    if (!this.emailUsuario) {
      this.mensagem = 'Erro: Email não encontrado. Faça login com o Spotify novamente.';
      return;
    }

    this.carregando = true;
    this.mensagem = '';

    // O pacotinho de dados que o FastAPI tá esperando
    const payload = {
      email: this.emailUsuario,
      nova_senha: this.novaSenha
    };

    // Chama o carteiro!
    this.authService.cadastrarSenha(payload).subscribe({
      next: (resposta) => {
        this.mensagem = '✅ ' + resposta.message;
        this.carregando = false;
        this.novaSenha = '';
        this.confirmarSenha = '';
      },
      error: (erro) => {
        // Se o FastAPI devolver aquele erro 404 de "Usuário não encontrado"
        this.mensagem = '❌ Erro: ' + (erro.error?.detail || 'Falha ao conectar com o servidor.');
        this.carregando = false;
      }
    });
  }
}