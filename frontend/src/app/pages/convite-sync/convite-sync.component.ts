import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SyncService, SyncPermissions, InviteDetails } from '../../core/services/sync.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-convite-sync',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './convite-sync.component.html',
  styleUrls: ['./convite-sync.component.scss']
})
export class ConviteSyncComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private syncService = inject(SyncService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  codigoConvite: string = '';
  convite: InviteDetails | null = null;
  carregando: boolean = true;
  erroMensagem: string | null = null;

  // Estado do usuário atual
  estaLogado: boolean = false;
  emailUsuarioLogado: string | null = null;
  nomeUsuarioLogado: string | null = null;

  // Permissões que o convidado escolhe conceder de volta
  minhasPermissoes: SyncPermissions = {
    share_minutes: true,
    share_top_tracks: true,
    share_top_artists: true,
    share_peak_time: true
  };

  aceitando: boolean = false;
  conectadoComSucesso: boolean = false;
  jaConectados: boolean = false;
  modoEscuro: boolean = true;

  ngOnInit() {
    // Sincroniza tema
    if (typeof window !== 'undefined') {
      const tema = localStorage.getItem('tunify_tema');
      this.modoEscuro = (tema !== 'claro');
      if (!this.modoEscuro) {
        document.body.classList.add('tema-claro');
      }
    }

    this.codigoConvite = this.route.snapshot.paramMap.get('codigo') || '';
    if (!this.codigoConvite) {
      this.erroMensagem = 'Código de convite não fornecido.';
      this.carregando = false;
      return;
    }

    this.verificarSessao();
  }

  verificarSessao() {
    this.estaLogado = this.authService.estaLogado();
    if (!this.estaLogado) {
      this.carregarConvite();
      return;
    }
    this.authService.obterIdentidade().subscribe({
      next: user => {
        this.emailUsuarioLogado = user.email;
        this.nomeUsuarioLogado = user.nome || user.email;
        this.carregarConvite();
      },
      error: (err) => {
        if (err.status !== 401) {
          this.erroMensagem = 'Não foi possível verificar sua sessão. Atualize a página para tentar novamente.';
          this.carregando = false;
          this.cdr.detectChanges();
          return;
        }
        this.authService.logout();
        this.estaLogado = false;
        this.carregarConvite();
      }
    });
  }

  carregarConvite() {
    this.carregando = true;
    this.erroMensagem = null;

    this.syncService.obterDetalhesConvite(this.codigoConvite).subscribe({
      next: (dados) => {
        this.convite = dados;
        this.jaConectados = dados.is_already_connected;
        if (!this.jaConectados && !dados.is_valid) this.erroMensagem = dados.message || 'Este convite não está mais disponível.';
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[ConviteSync] Erro ao carregar convite:', err);
        if (err.status === 404) {
          this.erroMensagem = 'Convite não encontrado ou link inexistente.';
        } else {
          this.erroMensagem = 'Não foi possível carregar as informações deste convite.';
        }
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  alternarPermissao(chave: keyof SyncPermissions) {
    this.minhasPermissoes[chave] = !this.minhasPermissoes[chave];
  }

  fazerLoginParaAceitar() {
    this.authService.guardarConvite(this.codigoConvite);
    this.authService.entrarComSpotify();
  }

  fazerLoginLocal() {
    this.authService.guardarConvite(this.codigoConvite);
    this.router.navigate(['/login']);
  }

  aceitarConexao() {
    if (!this.estaLogado || !this.emailUsuarioLogado || !this.convite?.is_valid || this.jaConectados || this.aceitando) return;

    this.aceitando = true;
    this.erroMensagem = null;

    this.syncService.aceitarConvite(this.codigoConvite, this.minhasPermissoes).subscribe({
      next: () => {
        this.aceitando = false;
        this.conectadoComSucesso = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[ConviteSync] Erro ao aceitar:', err);
        this.aceitando = false;
        if (err.status === 401) {
          this.authService.logout();
          this.estaLogado = false;
          this.erroMensagem = 'Sua sessão expirou. Entre novamente para aceitar o convite.';
        } else if (err.status === 409) {
          this.jaConectados = true;
        } else if (err.status === 410) {
          this.erroMensagem = 'Este convite expirou. Peça ao seu amigo para gerar um novo.';
        } else {
          this.erroMensagem = err.error?.detail || 'Falha ao aceitar a conexão.';
        }
        this.cdr.detectChanges();
      }
    });
  }

  irParaDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
