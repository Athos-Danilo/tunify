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
   * Busca o total de minutos que o robô da faxina calculou
   */
  obterMinutosOuvidos(email: string): Observable<any> {
    console.log(`[SERVIÇO] Indo no Python buscar os minutos de: ${email}...`);
    return this.http.get(`${this.backendUrl}/minutos/${email}`);
  }
}