import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 1. Importando a nossa caixa inteligente!
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private http = inject(HttpClient);
  
  // 2. Agora a URL base vem do ambiente (PC ou Nuvem) + o caminho do dashboard
  private backendUrl = `${environment.apiUrl}/dashboard`;

  /**
   * Busca o total de minutos e o total de artistas que o usuário ouviu no mês
   */
  obterMinutosOuvidos(email: string): Observable<any> {
    console.log(`[SERVIÇO] Indo no Python buscar os minutos e artistas de: ${email}...`);
    return this.http.get(`${this.backendUrl}/minutos/${email}`);
  }

  /**
   * 🚨 NOVA ROTA: Busca o Top Artistas do Mês (com status de Subiu/Desceu/Novo)
   */
  obterTopArtistas(email: string): Observable<any> {
    console.log(`[SERVIÇO] Indo no Python buscar o Top Artistas de: ${email}...`);
    return this.http.get(`${this.backendUrl}/top_artistas/${email}`);
  }
}