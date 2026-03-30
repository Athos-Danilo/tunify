import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Necessário para filtrar o total de playlists

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private http = inject(HttpClient);
  private backendUrl = 'http://localhost:8000/api/v1/spotify';

  /**
   * 🚨 NOVA FUNÇÃO: Busca o Perfil Completo do Usuário
   * Por enquanto ela busca as playlists, mas já isola o total para o Card.
   * Quando RN16 for implementada no Python, mudamos a rota aqui.
   */
  buscarResumoPerfil(email: string): Observable<any> {
    console.log(`[SERVIÇO] Indo no Python buscar resumo de: ${email}...`);
    // Retorna a bandeja inteira do jeito que vier do Python!
    return this.http.get(`${this.backendUrl}/playlists/${email}`);
  }
}