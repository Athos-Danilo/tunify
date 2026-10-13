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

    this.verificarSessao();

    this.codigoConvite = this.route.snapshot.paramMap.get('codigo') || '';
    if (!this.codigoConvite) {
      this.erroMensagem = 'Código de convite não fornecido.';
      this.carregando = false;
      return;
    }

    this.carregarConvite();
  }

  verificarSessao() {
    this.estaLogado = this.authService.estaLogado();
    if (typeof window !== 'undefined') {
      const userInfoStr = localStorage.getItem('tunify_user_info');
      if (userInfoStr) {
        try {
          const user = JSON.parse(userInfoStr);
          this.emailUsuarioLogado = user.email || null;
          this.nomeUsuarioLogado = user.nome || user.display_name || user.email;
        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  carregarConvite() {
    this.carregando = true;
    this.erroMensagem = null;

    this.syncService.obterDetalhesConvite(this.codigoConvite, this.emailUsuarioLogado || undefined).subscribe({
      next: (dados) => {
        this.convite = dados;
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
    // Salva o convite para processar após o login
    if (typeof window !== 'undefined') {
      localStorage.setItem('tunify_convite_pendente', this.codigoConvite);
    }
    // Redireciona para o login do Spotify
    window.location.href = 'http://localhost:8000/api/v1/auth/login';
  }

  aceitarConexao() {
    if (!this.emailUsuarioLogado || !this.convite) return;

    this.aceitando = true;
    this.erroMensagem = null;

    this.syncService.aceitarConvite(this.codigoConvite, this.emailUsuarioLogado, this.minhasPermissoes).subscribe({
      next: () => {
        this.aceitando = false;
        this.conectadoComSucesso = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[ConviteSync] Erro ao aceitar:', err);
        this.aceitando = false;
        if (err.status === 409) {
          this.erroMensagem = 'Vocês já estão conectados no Tunify Sync!';
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
