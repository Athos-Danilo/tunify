import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  standalone: true,
  template: `
    <div class="loading-screen">
      <h2>Conectando ao Spotify... 🎧</h2>
      <p>Ajustando a sua Vibe...</p>
    </div>
  `,
  // Se você tiver um CSS bonitinho pra essa tela, pode manter o styleUrl aqui:
  // styleUrl: './callback.component.scss'
})
export class CallbackComponent implements OnInit {
  
  // Injetamos as ferramentas do Angular para ler a URL (ActivatedRoute) e para mudar de página (Router)
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    // Fica escutando a URL em busca de parâmetros (?token=...&nome=...)
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const nome = params['nome'];
      const email = params['email'];

      if (token && nome) {
        console.log('[SUCESSO] O Porteiro pegou os dados da URL!');
        
        // 1. Tranca os dados no cofre do navegador
        localStorage.setItem('spotify_token', token);
        localStorage.setItem('usuario_nome', nome);
        localStorage.setItem('usuario_email', email);

        // 2. Libera a catraca e manda o usuário direto para a Área VIP
        this.router.navigate(['/dashboard']);
        
      } else {
        console.error('[ERRO] Acesso negado. Cadê o token?');
        // Se alguém tentar entrar na página /callback direto, é chutado pra Home
        this.router.navigate(['/']);
      }
    });
  }
}