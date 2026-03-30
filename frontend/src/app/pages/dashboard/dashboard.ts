import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="dashboard-container">
      <h1>Área VIP do Tunify 🎧</h1>
      
      <h2>Bem-vindo(a), {{ nomeUsuario }}! ✨</h2>
      
      <p>A ponte foi um sucesso. O seu token super secreto está trancado no cofre do navegador!</p>
      
      <button class="btn-logout" (click)="fazerLogout()">Sair / Logout</button>
    </div>
  `,
  // Um CSS rapidinho só pra não ficar um texto preto numa tela branca kkkk
  styles: [`
    .dashboard-container {
      text-align: center;
      padding: 100px 20px;
      font-family: sans-serif;
      color: #ffffff;
      background-color: #121212; /* O fundão escuro padrão do Spotify */
      min-height: 100vh;
    }
    h1 { color: #1DB954; /* O verde do Spotify */ }
    .btn-logout {
      margin-top: 30px;
      padding: 12px 24px;
      background-color: transparent;
      color: white;
      border: 2px solid #1DB954;
      border-radius: 50px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .btn-logout:hover {
      background-color: #1DB954;
      color: black;
    }
  `]
})
export class DashboardComponent implements OnInit {
  
  // Variável que vai guardar o seu nome para mostrar no HTML
  nomeUsuario: string | null = '';
  
  // Injeta o GPS do Angular
  private router = inject(Router);

  ngOnInit() {
    // 1. Assim que a tela carrega, o Angular abre o cofre e puxa o seu nome
    this.nomeUsuario = localStorage.getItem('usuario_nome');
    
    // 2. Trava de Segurança VIP: Se o cara não tiver o token no cofre, é chutado pra rua!
    if (!localStorage.getItem('spotify_token')) {
      console.warn('[ALERTA] Intruso detectado! Redirecionando para a Home...');
      this.router.navigate(['/']);
    }
  }

  // Função que roda quando clica no botão de Logout
  fazerLogout() {
    console.log('[INFO] Limpando o cofre e saindo do sistema...');
    localStorage.clear(); // Apaga o token e o nome
    this.router.navigate(['/']); // Joga de volta pra Landing Page
  }
}
