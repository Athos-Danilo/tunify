import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Isso significa que o serviço é Global. Qualquer tela pode chamar ele!
})
export class SpotifyService {

  // A ferramenta que faz as chamadas de rede (o garçom)
  private http = inject(HttpClient);
  
  // O endereço da nossa cozinha (O Back-end em Python)
  private backendUrl = 'http://localhost:8000/api/v1/spotify';

  // A função que vai lá buscar as playlists usando o e-mail
  buscarPlaylists(email: string): Observable<any> {
    console.log(`[SERVIÇO] Indo no Python buscar as playlists de: ${email}...`);
    return this.http.get(`${this.backendUrl}/playlists/${email}`);
  }
}