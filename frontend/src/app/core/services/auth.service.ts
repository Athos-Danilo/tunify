import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Aqui você ajusta para o caminho correto do seu arquivo de environments
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // A URL base do seu FastAPI (ex: http://localhost:8000/api/auth)
  private apiUrl = `${environment.apiUrl}/auth`; 
  
  // A chave que vamos usar para guardar o passaporte no navegador
  private readonly TOKEN_KEY = 'tunify_jwt_token';
  private readonly USER_INFO_KEY = 'tunify_user_info';

  constructor(private http: HttpClient) { }

  // ======================================================================= //
  //                      Chamadas para o Backend (FastAPI)                  //
  // ======================================================================= //

  // 1. O Carteiro do Login Local
  loginLocal(dados: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/local/login`, dados);
  }

  // 2. O Carteiro de Cadastrar Senha
  cadastrarSenha(dados: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/local/cadastrar-senha`, dados);
  }


  // ======================================================================= //
  //                      Gerenciamento da Memória (Local Storage)           //
  // ======================================================================= //

  // Salva o passaporte e os dados básicos no navegador
  salvarSessao(token: string, usuario: any): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(usuario));
  }

  // Pega o passaporte (útil para o Guarda-Costas depois)
  obterToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Descobre se o usuário tá logado (se tem token salvo)
  estaLogado(): boolean {
    return !!this.obterToken();
  }

  // O botão de Sair (Apaga a memória do navegador)
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_INFO_KEY);
    // Aqui você também pode forçar um reload na página ou jogar pro /login
  }
}