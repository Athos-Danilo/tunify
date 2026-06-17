import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // 🚨 IMPORTADO HttpHeaders
import { Observable, of } from 'rxjs'; // 🚨 IMPORTADO of
import { map, switchMap, catchError } from 'rxjs/operators'; // 🚨 IMPORTADOS switchMap e catchError

// 1. Importando a nossa caixa inteligente!
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private http = inject(HttpClient);
  
  // 2. Agora a URL base vem do ambiente (PC ou Nuvem) + o caminho do spotify
  private backendUrl = `${environment.apiUrl}/spotify`;

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

  /**
   * 🚨 [NOVO] Busca a música atual e traz os milissegundos para o nosso cronômetro!
   */
  obterMusicaAtualOuUltima(token: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.get<any>('https://api.spotify.com/v1/me/player/currently-playing', { headers }).pipe(
      switchMap(response => {
        // Se tem uma resposta, tem um item, E o player está rodando agora!
        if (response && response.item && response.is_playing) {
          return of({
            nome: response.item.name,
            artista: response.item.artists.map((a: any) => a.name).join(', '),
            tocandoAgora: true,
            // 🚨 Pegamos o tempo exato para a matemática do Dashboard!
            progress_ms: response.progress_ms,
            duration_ms: response.item.duration_ms 
          });
        }
        // Se a música estiver pausada (is_playing == false) ou a resposta for vazia, puxa o histórico
        return this.buscarUltimaTocada(headers);
      }),
      catchError(() => {
        return this.buscarUltimaTocada(headers);
      })
    );
  }

  // 🚨 [NOVO] Função auxiliar: Pega a última música do histórico
  private buscarUltimaTocada(headers: HttpHeaders): Observable<any> {
    // limit=1 garante que ele traga apenas 1 música para economizar memória
    return this.http.get<any>('https://api.spotify.com/v1/me/player/recently-played?limit=1', { headers }).pipe(
      map(response => {
        // Verifica se o Spotify devolveu pelo menos uma música no histórico
        if (response && response.items && response.items.length > 0) {
          const track = response.items[0].track;
          return {
            nome: track.name,
            artista: track.artists.map((a: any) => a.name).join(', '),
            tocandoAgora: false // Marcador para o HTML saber que é do passado
          };
        }
        return null; // Caso a conta seja totalmente nova e sem histórico
      }),
      catchError(() => of(null)) // Se a API falhar, não quebra a tela, apenas retorna vazio
    );
  }

  // ==========================================================
  // 🚨 MÁGICA DA PLAYLIST (CRIAR E POPULAR) - URLS CORRIGIDAS
  // ==========================================================

  // 1. Pega o Perfil do usuário logado (Precisamos do ID dele)
  obterPerfilSpotify(token: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get('https://api.spotify.com/v1/me', { headers });
  }

  // 2. Cria a "Casca" da Playlist vazia
  criarPlaylist(userId: string, token: string, nome: string, descricao: string): Observable<any> {
    const headers = new HttpHeaders({ 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const body = {
      name: nome,
      description: descricao,
      public: false // Mantemos privada no começo para respeitar o usuário
    };
    // 🚨 URL Oficial de criação atualizada (Fevereiro/2026) - Agora usamos /me/playlists
    return this.http.post(`https://api.spotify.com/v1/me/playlists`, body, { headers });
  }

  // 3. Injeta o Array de Músicas na Playlist
  adicionarMusicasPlaylist(playlistId: string, token: string, uris: string[]): Observable<any> {
    const headers = new HttpHeaders({ 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const body = { uris: uris };
    // 🚨 URL Oficial para adicionar faixas (Agora usando /items em vez de /tracks que foi descontinuado)
    return this.http.post(`https://api.spotify.com/v1/playlists/${playlistId}/items`, body, { headers });
  }

  // 4. 🚨 [NOVO] Envia a foto personalizada gerada no Canvas para o Spotify
  uploadCapaPlaylist(playlistId: string, token: string, imagemBase64: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'image/jpeg' // O Spotify exige estritamente image/jpeg para capas
    });
    // Envia o texto Base64 puro direto na requisição PUT
    return this.http.put(`https://api.spotify.com/v1/playlists/${playlistId}/images`, imagemBase64, { headers });
  }
}