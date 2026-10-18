import { Component, OnInit, Input, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SyncService, SyncPermissions, InviteSummary, ConnectionItem } from '../../core/services/sync.service';

@Component({
  selector: 'app-sync-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sync-card.component.html',
  styleUrls: ['./sync-card.component.scss']
})
export class SyncCardComponent implements OnInit {
  @Input() email: string = '';
  @Input() modoEscuro: boolean = true;

  private syncService = inject(SyncService);
  private cdr = inject(ChangeDetectorRef);

  // Aba ativa: 'convidar' ou 'amigos'
  abaAtiva: 'convidar' | 'amigos' = 'convidar';

  // Configuração das 4 permissões ativas na Fase 1
  permissoes: SyncPermissions = {
    share_minutes: true,
    share_top_tracks: true,
    share_top_artists: true,
    share_peak_time: true
  };

  // Estados de carregamento e feedback
  gerandoConvite: boolean = false;
  carregandoDados: boolean = false;
  linkCopiado: boolean = false;
  mensagemSucesso: string | null = null;
  mensagemErro: string | null = null;

  // Convite ativo mais recente gerado
  conviteAtivo: InviteSummary | null = null;

  // Lista de amigos conectados
  amigosConectados: ConnectionItem[] = [];

  ngOnInit() {
    if (this.email) {
      this.carregarDadosIniciais();
    }
  }

  carregarDadosIniciais() {
    this.carregandoDados = true;

    // Busca convites pendentes já existentes
    this.syncService.listarMeusConvitesAtivos(this.email).subscribe({
      next: (convites) => {
        if (convites && convites.length > 0) {
          this.conviteAtivo = convites[0];
          this.permissoes = { ...convites[0].permissions };
        }
        this.carregarConexoes();
      },
      error: () => {
        this.carregarConexoes();
      }
    });
  }

  carregarConexoes() {
    this.syncService.listarConexoes(this.email).subscribe({
      next: (conexoes) => {
        this.amigosConectados = conexoes || [];
        this.carregandoDados = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.carregandoDados = false;
        this.cdr.detectChanges();
      }
    });
  }

  alternarPermissao(chave: keyof SyncPermissions) {
    this.permissoes[chave] = !this.permissoes[chave];
  }

  gerarNovoConvite() {
    if (!this.email) return;

    this.gerandoConvite = true;
    this.mensagemErro = null;
    this.mensagemSucesso = null;

    this.syncService.criarConvite(this.email, this.permissoes).subscribe({
      next: (novoConvite) => {
        this.conviteAtivo = novoConvite;
        this.gerandoConvite = false;
        this.mensagemSucesso = 'Link exclusivo criado com sucesso! Compartilhe com seu amigo.';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[SyncCard] Erro ao criar convite:', err);
        this.mensagemErro = 'Não foi possível gerar o convite no momento. Tente novamente.';
        this.gerandoConvite = false;
        this.cdr.detectChanges();
      }
    });
  }

  copiarLink() {
    if (!this.conviteAtivo) return;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(this.conviteAtivo.invite_url).then(() => {
        this.notificarCopia();
      });
    } else {
      // Fallback
      const input = document.createElement('textarea');
      input.value = this.conviteAtivo.invite_url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      this.notificarCopia();
    }
  }

  private notificarCopia() {
    this.linkCopiado = true;
    setTimeout(() => {
      this.linkCopiado = false;
      this.cdr.detectChanges();
    }, 2500);
    this.cdr.detectChanges();
  }

  compartilharWhatsApp() {
    if (!this.conviteAtivo) return;
    const texto = encodeURIComponent(
      `Ei! Bora comparar a nossa vibe musical? Te convidei pro Tunify Sync! Clica no link pra conectar: ${this.conviteAtivo.invite_url}`
    );
    window.open(`https://api.whatsapp.com/send?text=${texto}`, '_blank');
  }

  revogarConviteAtual() {
    if (!this.conviteAtivo || !this.email) return;

    const codigo = this.conviteAtivo.invite_code;
    this.syncService.revogarConvite(codigo, this.email).subscribe({
      next: () => {
        this.conviteAtivo = null;
        this.mensagemSucesso = 'Convite cancelado com sucesso.';
        setTimeout(() => {
          this.mensagemSucesso = null;
          this.cdr.detectChanges();
        }, 3000);
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensagemErro = 'Falha ao cancelar o convite.';
        this.cdr.detectChanges();
      }
    });
  }
}
