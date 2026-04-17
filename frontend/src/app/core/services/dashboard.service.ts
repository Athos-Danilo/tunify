import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private http = inject(HttpClient);
  // 🚨 Repare que aqui a URL aponta para o nosso novo arquivo Python (dashboard.py)
  private backendUrl = 'http://localhost:8000/api/v1/dashboard';

  /**
   * Busca o total de minutos que o robô da faxina calculou
   */
  obterMinutosOuvidos(email: string): Observable<any> {
    console.log(`[SERVIÇO] Indo no Python buscar os minutos de: ${email}...`);
    return this.http.get(`${this.backendUrl}/minutos/${email}`);
  }
}