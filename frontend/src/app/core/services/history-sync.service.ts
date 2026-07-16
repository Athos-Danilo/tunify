import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin, throwError } from 'rxjs';
import { map, switchMap, catchError, retry, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SpotifyService } from './spotify.service';
import { SecureStorage } from '../utils/secure-storage';

@Injectable({
  providedIn: 'root'
})
export class HistorySyncService {
  private http = inject(HttpClient);
  private spotifyService = inject(SpotifyService);
  private backendUrl = `${environment.apiUrl}/history`;

  // Chave do cache e TTL (Time To Live) de 5 minutos
  private CACHE_KEY = 'tunify_history_cache';
  private CACHE_TTL_MS = 5 * 60 * 1000;

  /**
   * Ponto de entrada principal da tela.
   * Verifica o cache seguro primeiro. Se não existir ou expirou, 
   * orquestra a chamada dupla (Backend + Spotify Delta).
   */
  getMergedHistory(email: string, token: string): Observable<any[]> {
    if (typeof window === 'undefined') return of([]);

    // 1. Tentar Cache
    const cachedData = SecureStorage.getItem<{ timestamp: number, items: any[] }>(this.CACHE_KEY);
    if (cachedData) {
      const now = new Date().getTime();
      if (now - cachedData.timestamp < this.CACHE_TTL_MS) {
        console.log('[HistorySync] Servindo dados em 0ms do SecureCache! 🔒');
        return of(cachedData.items);
      } else {
        console.log('[HistorySync] Cache expirou. Buscando dados frescos...');
      }
    }

    // 2. Orquestrar Sincronização Delta
    return this.http.get<any>(`${this.backendUrl}/recent/${email}`).pipe(
      switchMap(dbData => {
        const dbItems = dbData.items || [];
        const lastPlayedMs = dbData.last_played_at_ms || 0;

        console.log(`[HistorySync] DB retornou ${dbItems.length} faixas. Última tocada em ${lastPlayedMs}`);

        // 3. Buscar Delta no Spotify (com limite de segurança e retry)
        return this.spotifyService.getHistoricoRecente(token, 50, lastPlayedMs).pipe(
          retry({ count: 1, delay: 5000 }), // Se der 429 ou erro, tenta mais 1 vez após 5 seg
          switchMap(spotifyDelta => {
            // Salvar no backend para manter sincronizado imediatamente
            if (spotifyDelta.length > 0) {
              console.log(`[HistorySync] Spotify retornou ${spotifyDelta.length} novas faixas (Delta)! Salvando no DB...`);
              return this.http.post(`${this.backendUrl}/recent/${email}`, { items: spotifyDelta }).pipe(
                map(() => ({ dbItems, spotifyDelta }))
              );
            }
            return of({ dbItems, spotifyDelta });
          }),
          catchError(err => {
            console.error('[HistorySync] Falha ao consultar Spotify/Backend no Delta Sync. Usando apenas DB.', err);
            // Fallback gracefully: devolve o que tem no banco de dados para a tela não quebrar
            return of({ dbItems, spotifyDelta: [] });
          })
        );
      }),
      map(({ dbItems, spotifyDelta }) => {
        // Formatar o Spotify Delta para ficar igual ao DB
        const formattedDelta = spotifyDelta.map((item: any) => ({
          nome: item.track.name,
          artistas: item.track.artists.map((a: any) => a.name).join(', '),
          imagem: item.track.album.images[0]?.url || 'https://via.placeholder.com/64',
          album: item.track.album.name,
          generos: '-', // Gêneros não vêm direto no recently-played
          tocadaEm: item.played_at,
          duracaoMs: item.track.duration_ms,
          source: 'spotify_delta'
        }));

        // Fazer o Merge (Novos no topo)
        const finalArray = [...formattedDelta, ...dbItems];
        
        // 4. Guardar no SecureStorage com o tempo atual
        SecureStorage.setItem(this.CACHE_KEY, {
          timestamp: new Date().getTime(),
          items: finalArray
        });

        return finalArray;
      })
    );
  }

  /**
   * Força a limpeza do cache caso o usuário aperte um botão de atualizar manualmente
   */
  clearCache(): void {
    SecureStorage.removeItem(this.CACHE_KEY);
  }
}
