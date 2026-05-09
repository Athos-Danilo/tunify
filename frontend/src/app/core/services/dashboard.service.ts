import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private http = inject(HttpClient);
  private backendUrl = `${environment.apiUrl}/dashboard`;

  // 1. Nossas variáveis de memória (Caches)
  private cacheMinutos$: Observable<any> | null = null;
  private cacheTopArtistas$: Observable<any> | null = null;

  // 2. Definindo o tempo de validade do cache em milissegundos
  // Exemplo: 5 minutos = 5 * 60 * 1000 = 300000 ms
  private readonly TEMPO_CACHE_MS = 300000; 

  /**
   * Busca o total de minutos e o total de artistas que o usuário ouviu no mês
   */
  obterMinutosOuvidos(email: string): Observable<any> {
    
    // Se o cache não existe (ou foi apagado pelo cronômetro), busca no backend
    if (!this.cacheMinutos$) {
      console.log(`[SERVIÇO] API Chamada: Buscando MINUTOS... (Cache vazio ou expirado)`);
      
      this.cacheMinutos$ = this.http.get(`${this.backendUrl}/minutos/${email}`).pipe(
        shareReplay(1) // Guarda a resposta para os próximos que pedirem
      );

      // O Pulo do Gato: Programa a autodestruição do cache!
      setTimeout(() => {
        this.cacheMinutos$ = null;
        console.log(`[SERVIÇO] O cache de MINUTOS expirou após 5 min!`);
      }, this.TEMPO_CACHE_MS);
    }

    return this.cacheMinutos$;
  }

  /**
   * Busca o Top Artistas do Mês (com status de Subiu/Desceu/Novo)
   */
  obterTopArtistas(email: string): Observable<any> {
    
    if (!this.cacheTopArtistas$) {
      console.log(`[SERVIÇO] API Chamada: Buscando ARTISTAS... (Cache vazio ou expirado)`);
      
      this.cacheTopArtistas$ = this.http.get(`${this.backendUrl}/top_artistas/${email}`).pipe(
        shareReplay(1)
      );

      // Autodestruição do cache de artistas
      setTimeout(() => {
        this.cacheTopArtistas$ = null;
        console.log(`[SERVIÇO] O cache de ARTISTAS expirou após 5 min!`);
      }, this.TEMPO_CACHE_MS);
    }

    return this.cacheTopArtistas$;
  }

  /**
   * Limpa tudo imediatamente (Usar no botão de Logout!)
   */
  limparCache() {
    this.cacheMinutos$ = null;
    this.cacheTopArtistas$ = null;
  }
}