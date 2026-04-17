import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Necessário para filtrar o total de playlists

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private http = inject(HttpClient);
  // A sua URL já está configurada perfeitamente!
  private backendUrl = 'http://localhost:8000/api/v1/spotify';

  /**
   * 🚨 Rota Antiga: Busca o Perfil Completo do Usuário
   */
  buscarResumoPerfil(email: string): Observable<any> {
    console.log(`[SERVIÇO] Indo no Python buscar resumo de: ${email}...`);
    // Retorna a bandeja inteira do jeito que vier do Python!
    return this.http.get(`${this.backendUrl}/playlists/${email}`);
  }

  /**
   * 🚨 NOVA ROTA: Busca o Top 10 do Mês (Precisão Absoluta)
   */
  getTopMensal(email: string): Observable<any> {
    console.log(`[SERVIÇO] Indo no Python buscar o Top 10 Mensal de: ${email}...`);
    return this.http.get(`${this.backendUrl}/top-mensal/${email}`); // Coloca na URL
  }
}