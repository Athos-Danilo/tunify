import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-callback',
  standalone: true,
  template: `
    <div class="loading-screen">
      <h2>Conectando ao Spotify... 🎧</h2>
      <p>Ajustando a sua Vibe...</p>
    </div>
  `,
})
export class CallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    const fragment$ = this.route.fragment ?? of(null);
    const queryParams$ = this.route.queryParams ?? of({} as Record<string, string>);

    combineLatest([fragment$, queryParams$])
      .pipe(
        map(([fragment, queryParams]) => {
          const fragParams = new URLSearchParams(fragment || '');
          const hashParams =
            typeof window !== 'undefined' && window.location.hash
              ? new URLSearchParams(window.location.hash.replace(/^#/, ''))
              : new URLSearchParams();
          const searchParams =
            typeof window !== 'undefined' && window.location.search
              ? new URLSearchParams(window.location.search)
              : new URLSearchParams();

          const get = (key: string): string | null =>
            fragParams.get(key) ||
            (queryParams && queryParams[key]) ||
            this.route.snapshot?.queryParamMap?.get(key) ||
            hashParams.get(key) ||
            searchParams.get(key);

          return {
            token: get('token'),
            jwt: get('jwt'),
            nome: get('nome'),
            email: get('email'),
          };
        })
      )
      .subscribe(({ token, jwt, nome, email }) => {
        if (token && (email || nome)) {
          const emailFinal = email || nome || '';
          const nomeFinal = nome || emailFinal;
          const usuario = { nome: nomeFinal, email: emailFinal, spotify_token: token };

          this.authService.salvarSessao(jwt || token, usuario);

          localStorage.setItem('spotify_token', token);
          localStorage.setItem('usuario_nome', nomeFinal);
          localStorage.setItem('usuario_email', emailFinal);

          this.router.navigate(this.authService.destinoAposLogin(), { replaceUrl: true });
        } else {
          console.error('[ERRO] Acesso negado. Cadê o token?');
          this.router.navigate(['/']);
        }
      });
  }
}
