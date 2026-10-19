import { Component, OnInit, OnDestroy, Input, inject, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
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
export class SyncCardComponent implements OnInit, OnDestroy {
  @Input() email: string = '';
  @Input() modoEscuro: boolean = true;

  private syncService = inject(SyncService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  precisaLogin = false;

  // Aba ativa: 'convidar' ou 'amigos'
  private atualizacao?: ReturnType<typeof setInterval>;
  editandoConexao: number | null = null;
  salvandoPermissoes = false;
  permissoesEdicao: SyncPermissions | null = null;

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
      this.atualizacao = setInterval(() => this.carregarDadosIniciais(), 30000);
    }
  }

  ngOnDestroy() {
    clearInterval(this.atualizacao);
  }

  entrarNovamente() {
    this.router.navigate(['/login']);
  }

  private mostrarErro(err: HttpErrorResponse, mensagem: string) {
    this.mensagemSucesso = null;
    this.mensagemErro = mensagem;
    if (err.status === 401) {
      this.precisaLogin = true;
      this.conviteAtivo = null;
      this.amigosConectados = [];
      this.mensagemErro = 'Sua sessão expirou. Entre novamente para gerenciar os convites.';
      clearInterval(this.atualizacao);
    }
    this.cdr.detectChanges();
  }

  editarPermissoes(conexao: ConnectionItem) {
    this.editandoConexao = conexao.connection_id;
    this.permissoesEdicao = { ...conexao.minhas_permissoes_para_ele };
  }

  salvarPermissoes() {
    if (this.editandoConexao === null || !this.permissoesEdicao || this.salvandoPermissoes) return;
    this.salvandoPermissoes = true;
    this.syncService.atualizarPermissoes(this.editandoConexao, this.permissoesEdicao).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.salvandoPermissoes = false;
        this.editandoConexao = null;
        this.mensagemSucesso = 'Permissões atualizadas.';
        this.carregarDadosIniciais();
      },
      error: (err) => {
        this.salvandoPermissoes = false;
        this.mostrarErro(err, 'Não foi possível atualizar as permissões.');
      }
    });
  }

  desconectar(conexao: ConnectionItem) {
    this.syncService.desconectar(conexao.connection_id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.mensagemSucesso = 'Conexão encerrada.';
        this.editandoConexao = null;
        this.carregarDadosIniciais();
      },
      error: (err) => {
        this.mostrarErro(err, 'Não foi possível encerrar a conexão.');
      }
    });
  }

  carregarDadosIniciais() {
    this.carregandoDados = true;

    // Busca convites pendentes já existentes
    this.syncService.listarMeusConvitesAtivos().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (convites) => {
        this.conviteAtivo = convites?.[0] || null;
        if (convites && convites.length > 0) {
          this.conviteAtivo = convites[0];
          this.permissoes = { ...convites[0].permissions };
        }
        this.carregarConexoes();
      },
      error: (err) => {
        this.carregandoDados = false;
        this.mostrarErro(err, 'Não foi possível atualizar os convites.');
        if (err.status !== 401) this.carregarConexoes();
      }
    });
  }

  carregarConexoes() {
    this.syncService.listarConexoes().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (conexoes) => {
        this.amigosConectados = conexoes || [];
        this.carregandoDados = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.carregandoDados = false;
        this.mostrarErro(err, 'Não foi possível atualizar as conexões.');
      }
    });
  }

  alternarPermissao(chave: keyof SyncPermissions) {
    if (this.conviteAtivo || this.gerandoConvite) return;
    this.permissoes[chave] = !this.permissoes[chave];
  }

  gerarNovoConvite() {
    if (!this.email || this.gerandoConvite || this.conviteAtivo) return;

    this.gerandoConvite = true;
    this.mensagemErro = null;
    this.mensagemSucesso = null;

    this.syncService.criarConvite(this.permissoes).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (novoConvite) => {
        this.conviteAtivo = novoConvite;
        this.permissoes = { ...novoConvite.permissions };
        this.gerandoConvite = false;
        this.mensagemSucesso = 'Link exclusivo criado com sucesso! Compartilhe com seu amigo.';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.gerandoConvite = false;
        this.mostrarErro(err, 'Não foi possível gerar o convite no momento. Tente novamente.');
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
    this.syncService.revogarConvite(codigo).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.conviteAtivo = null;
        this.carregarDadosIniciais();
        this.mensagemSucesso = 'Convite cancelado com sucesso.';
        setTimeout(() => {
          this.mensagemSucesso = null;
          this.cdr.detectChanges();
        }, 3000);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.mostrarErro(err, 'Falha ao cancelar o convite.');
      }
    });
  }
}
