import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'tunify_jwt_token';
  private readonly USER_INFO_KEY = 'tunify_user_info';

  constructor(private http: HttpClient) {}

  loginLocal(dados: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/local/login`, dados);
  }

  cadastrarSenha(dados: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/local/cadastrar-senha`, dados);
  }

  salvarSessao(token: string, usuario: any): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(usuario));
  }

  obterToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  obterIdentidade(): Observable<{ id: number; nome: string; email: string }> {
    return this.http.get<{ id: number; nome: string; email: string }>(`${this.apiUrl}/me`);
  }

  guardarConvite(codigo: string): void {
    if (/^vibe-[A-Za-z0-9]{1,12}$/.test(codigo)) {
      sessionStorage.setItem('tunify_convite_pendente', codigo);
    }
  }

  destinoAposLogin(): string[] {
    const codigo = sessionStorage.getItem('tunify_convite_pendente');
    sessionStorage.removeItem('tunify_convite_pendente');
    return codigo && /^vibe-[A-Za-z0-9]{1,12}$/.test(codigo)
      ? ['/sync/convite', codigo] : ['/dashboard'];
  }

  entrarComSpotify(): void {
    window.location.href = `${this.apiUrl}/login`;
  }

  temJwtValido(): boolean {
    try {
      const raw = this.obterToken();
      if (!raw) return false;
      const parts = raw.split('.');
      if (parts.length !== 3) return false;
      const claims = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      return typeof claims.exp === 'number' && claims.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  estaLogado(): boolean {
    const raw = this.obterToken();
    if (!raw) return false;
    if (raw.includes('.')) {
      return this.temJwtValido();
    }
    try {
      const info = JSON.parse(localStorage.getItem(this.USER_INFO_KEY) || '{}');
      const spotifyToken = info?.spotify_token || localStorage.getItem('spotify_token');
      const email = info?.email || localStorage.getItem('usuario_email');
      return !!(spotifyToken && email);
    } catch {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_INFO_KEY);
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('usuario_nome');
    localStorage.removeItem('usuario_email');
  }
}
