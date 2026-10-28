import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SyncPermissions {
  share_minutes: boolean;
  share_top_tracks: boolean;
  share_top_artists: boolean;
  share_peak_time: boolean;
}

export interface UserPublicInfo {
  id: number;
  nome: string;
  foto_perfil?: string;
}

export interface InviteSummary {
  id: number;
  invite_code: string;
  invite_url: string;
  permissions: SyncPermissions;
  status: string;
  expires_at: string;
  created_at: string;
}

export interface InviteDetails {
  invite_code: string;
  sender: UserPublicInfo;
  permissions: SyncPermissions;
  expires_at: string;
  status: string;
  is_valid: boolean;
  is_owner: boolean;
  is_already_connected: boolean;
  message?: string;
}

export interface ConnectionItem {
  connection_id: number;
  amigo: UserPublicInfo;
  minhas_permissoes_para_ele: SyncPermissions;
  permissoes_dele_para_mim: SyncPermissions;
  status: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/sync`;

  /**
   * Gera um novo link de convite exclusivo com as permissões escolhidas
   */
  criarConvite(permissions: SyncPermissions): Observable<InviteSummary> {
    return this.http.post<InviteSummary>(
      `${this.apiUrl}/convites`,
      { permissions }
    );
  }

  /**
   * Lista todos os convites ativos (não expirados e pendentes) criados pelo usuário
   */
  listarMeusConvitesAtivos(): Observable<InviteSummary[]> {
    return this.http.get<InviteSummary[]>(
      `${this.apiUrl}/convites/meus-ativos`
    );
  }

  /**
   * Consulta os detalhes de um convite específico para o convidado inspecionar
   */
  obterDetalhesConvite(codigo: string): Observable<InviteDetails> {
    return this.http.get<InviteDetails>(`${this.apiUrl}/convites/${encodeURIComponent(codigo)}`);
  }

  /**
   * Conecta os dois usuários, enviando as permissões de volta
   */
  aceitarConvite(codigo: string, permissions: SyncPermissions): Observable<ConnectionItem> {
    return this.http.post<ConnectionItem>(
      `${this.apiUrl}/convites/${encodeURIComponent(codigo)}/aceitar`,
      { permissions }
    );
  }

  /**
   * Revoga um convite pendente antes que alguém o utilize
   */
  revogarConvite(codigo: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/convites/${encodeURIComponent(codigo)}`
    );
  }

  atualizarPermissoes(connectionId: number, permissions: SyncPermissions): Observable<ConnectionItem> {
    return this.http.patch<ConnectionItem>(`${this.apiUrl}/conexoes/${connectionId}/permissoes`, permissions);
  }

  desconectar(connectionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/conexoes/${connectionId}`);
  }

  /**
   * Lista todos os amigos atualmente conectados e sincronizados
   */
  listarConexoes(): Observable<ConnectionItem[]> {
    return this.http.get<ConnectionItem[]>(
      `${this.apiUrl}/conexoes`
    );
  }
}
