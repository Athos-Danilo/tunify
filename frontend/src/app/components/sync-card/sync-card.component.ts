import { Component, OnInit, OnDestroy, Input, inject, ChangeDetectorRef, DestroyRef, ViewChild, ElementRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SyncService, SyncPermissions, InviteSummary, ConnectionItem } from '../../core/services/sync.service';

type Vista = 'amigos' | 'convidar' | 'receber' | 'detalhes';
type Filtro = 'todos' | 'veem' | 'compartilham';

@Component({
  selector: 'app-sync-card', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './sync-card.component.html', styleUrls: ['./sync-card.component.scss']
})
export class SyncCardComponent implements OnInit, OnDestroy {
  @Input() email = '';
  @Input() modoEscuro = true;
  @ViewChild('painel') painel?: ElementRef<HTMLDialogElement>;
  @ViewChild('conteudo') conteudo?: ElementRef<HTMLDivElement>;
  private syncService = inject(SyncService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private atualizacao?: ReturnType<typeof setInterval>;
  private rotacao?: ReturnType<typeof setInterval>;
  private copiaTimer?: ReturnType<typeof setTimeout>;
  private fecharTimer?: ReturnType<typeof setTimeout>;
  private overflowAnterior = '';
  painelAberto = false;
  fechando = false;
  pausado = false;
  slide = 0;
  vista: Vista = 'amigos';
  filtro: Filtro = 'todos';
  busca = '';
  conviteRecebido = '';
  erroCodigo = '';
  mostrarCodigo = false;
  confirmarDesconexao = false;
  desconectando = false;
  precisaLogin = false;
  editandoConexao: number | null = null;
  salvandoPermissoes = false;
  permissoesEdicao: SyncPermissions | null = null;
  selecionado: ConnectionItem | null = null;
  permissoes: SyncPermissions = { share_minutes: true, share_top_tracks: true, share_top_artists: true, share_peak_time: true };
  gerandoConvite = false;
  revogando = false;
  carregandoDados = false;
  dadosCarregados = false;
  linkCopiado = false;
  mensagemSucesso: string | null = null;
  mensagemErro: string | null = null;
  conviteAtivo: InviteSummary | null = null;
  amigosConectados: ConnectionItem[] = [];
  fotosFalhas = new Set<number>();
  readonly categorias: { chave: keyof SyncPermissions; nome: string; detalhe: string; icone: string }[] = [
    { chave: 'share_minutes', nome: 'Minutos ouvidos', detalhe: 'Seu tempo de música no mês', icone: '◷' },
    { chave: 'share_top_tracks', nome: 'Top músicas', detalhe: 'As 10 faixas que mais tocam por aí', icone: '♫' },
    { chave: 'share_top_artists', nome: 'Top artistas', detalhe: 'Os 15 artistas que acompanham você', icone: '✦' },
    { chave: 'share_peak_time', nome: 'Horário de pico', detalhe: 'O período em que você mais escuta', icone: '☾' }
  ];

  ngOnInit() {
    if (this.email) {
      this.carregarDadosIniciais();
      this.atualizacao = setInterval(() => {
        if (!document.hidden && !this.gerandoConvite && !this.revogando) this.carregarDadosIniciais();
      }, 30000);
    }
    this.rotacao = setInterval(() => {
      if (!this.pausado && !this.painelAberto && !document.hidden && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        this.slide = (this.slide + 1) % 3;
        this.cdr.markForCheck();
      }
    }, 6000);
  }

  ngOnDestroy() {
    clearInterval(this.atualizacao); clearInterval(this.rotacao);
    clearTimeout(this.copiaTimer); clearTimeout(this.fecharTimer);
    if (this.painelAberto) document.body.style.overflow = this.overflowAnterior;
    if (this.painel?.nativeElement.open) this.painel.nativeElement.close();
  }

  get mensagensCard(): string[] {
    const total = this.amigosConectados.length;
    if (!total) return ['Sua música também aproxima.', 'Você escolhe o que compartilhar.', 'Um convite. Novas conexões.'];
    const nomes = this.amigosConectados.slice(0, 2).map(c => c.amigo.nome.split(' ')[0]).join(' e ');
    return [total > 2 ? `Com ${nomes} e mais ${total - 2}` : `Com ${nomes}`,
      `${total} ${total === 1 ? 'conexão, muitas possibilidades' : 'pessoas no seu círculo musical'}`,
      'Sua música. Suas escolhas.'];
  }

  contar(permissoes: SyncPermissions): number { return this.categorias.filter(c => permissoes[c.chave]).length; }
  iniciais(nome: string): string { return nome.trim().split(/\s+/).slice(0, 2).map(n => n[0]).join('').toUpperCase(); }
  get amigosVisiveis(): ConnectionItem[] { return this.amigosConectados.slice(0, 5); }
  get amigosExtras(): number { return Math.max(0, this.amigosConectados.length - 5); }
  get primeiroNomeAmigo(): string {
    const nome = this.amigosConectados[0]?.amigo?.nome?.trim();
    return nome ? nome.split(/\s+/)[0] : 'seu amigo';
  }
  get resumoNomesAmigos(): string {
    const total = this.amigosConectados.length;
    if (!total) return 'Conectar Amigos';
    if (total === 1) return this.amigosConectados[0].amigo.nome;
    const primeiros = this.amigosConectados.slice(0, 2).map(c => c.amigo.nome.trim().split(/\s+/)[0]);
    return total === 2 ? `${primeiros[0]} e ${primeiros[1]}` : `${primeiros[0]}, ${primeiros[1]} +${total - 2}`;
  }
  get conexoesFiltradas(): ConnectionItem[] {
    return this.amigosConectados.filter(c => (!this.busca || c.amigo.nome.toLocaleLowerCase().includes(this.busca.toLocaleLowerCase())) &&
      (this.filtro === 'todos' || this.contar(this.filtro === 'veem' ? c.minhas_permissoes_para_ele : c.permissoes_dele_para_mim) > 0));
  }
  get validadeConvite(): string {
    if (!this.conviteAtivo) return '';
    const horas = Math.ceil((new Date(this.conviteAtivo.expires_at).getTime() - Date.now()) / 3600000);
    if (horas <= 0) return 'Expirado';
    return horas > 24 ? `Expira em ${Math.ceil(horas / 24)} dias` : `Expira em ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
  }

  abrirPainel() {
    if (this.painelAberto) return;
    this.vista = this.amigosConectados.length ? 'amigos' : 'convidar';
    this.overflowAnterior = document.body.style.overflow;
    this.painelAberto = true;
    this.fechando = false;
    this.painel?.nativeElement.showModal();
    if (this.conteudo) this.conteudo.nativeElement.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }
  fecharPainel(event?: Event) {
    event?.preventDefault();
    if (this.fechando) return;
    this.fechando = true;
    this.fecharTimer = setTimeout(() => {
      this.painel?.nativeElement.close();
      document.body.style.overflow = this.overflowAnterior;
      this.painelAberto = false; this.fechando = false;
      this.cdr.markForCheck();
    }, 220);
  }
  clicarFundo(event: MouseEvent) { if (event.target === this.painel?.nativeElement) this.fecharPainel(); }
  navegar(vista: Vista) {
    this.vista = vista; this.confirmarDesconexao = false;
    if (!this.precisaLogin) this.mensagemErro = null;
    this.mensagemSucesso = null;
    if (this.conteudo) this.conteudo.nativeElement.scrollTop = 0;
  }
  entrarNovamente() { this.fecharPainel(); this.router.navigate(['/login']); }
  private mostrarErro(err: HttpErrorResponse, mensagem: string) {
    if (this.destroyRef.destroyed) return;
    this.mensagemSucesso = null; this.mensagemErro = mensagem;
    if (err.status === 401) {
      this.precisaLogin = true; this.conviteAtivo = null; this.amigosConectados = [];
      this.mensagemErro = 'Sua sessão expirou. Entre novamente para continuar.';
      clearInterval(this.atualizacao);
    }
    this.cdr.markForCheck();
  }

  editarPermissoes(conexao: ConnectionItem) {
    this.selecionado = conexao; this.editandoConexao = conexao.connection_id;
    this.permissoesEdicao = { ...conexao.minhas_permissoes_para_ele };
    this.navegar('detalhes');
  }
  salvarPermissoes() {
    if (this.editandoConexao === null || !this.permissoesEdicao || this.salvandoPermissoes) return;
    this.salvandoPermissoes = true;
    this.syncService.atualizarPermissoes(this.editandoConexao, this.permissoesEdicao).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: conexao => {
        this.salvandoPermissoes = false;
        if (conexao.connection_id) { this.selecionado = conexao; this.permissoesEdicao = { ...conexao.minhas_permissoes_para_ele }; }
        this.mensagemErro = null; this.mensagemSucesso = 'Suas permissões foram salvas.';
        this.carregarDadosIniciais();
      }, error: err => { this.salvandoPermissoes = false; this.mostrarErro(err, 'Não foi possível salvar suas permissões.'); }
    });
  }
  desconectar(conexao: ConnectionItem) {
    if (!this.confirmarDesconexao || this.desconectando) return;
    this.desconectando = true;
    this.syncService.desconectar(conexao.connection_id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.desconectando = false; this.navegar('amigos'); this.selecionado = null;
        this.editandoConexao = null; this.mensagemSucesso = 'Conexão encerrada.'; this.carregarDadosIniciais();
      }, error: err => { this.desconectando = false; this.mostrarErro(err, 'Não foi possível encerrar a conexão.'); }
    });
  }
  carregarDadosIniciais() {
    if (this.carregandoDados || this.precisaLogin) return;
    this.carregandoDados = true;
    this.syncService.listarMeusConvitesAtivos().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: convites => {
        this.conviteAtivo = convites?.[0] || null;
        if (this.conviteAtivo) this.permissoes = { ...this.conviteAtivo.permissions };
        this.carregarConexoes();
      }, error: err => {
        this.mostrarErro(err, 'Não foi possível atualizar os convites.');
        if (err.status !== 401) this.carregarConexoes(); else this.carregandoDados = false;
      }
    });
  }
  carregarConexoes() {
    this.syncService.listarConexoes().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: conexoes => {
        this.amigosConectados = conexoes || [];
        if (this.selecionado) {
          const atual = this.amigosConectados.find(c => c.connection_id === this.selecionado!.connection_id);
          if (atual) this.selecionado = atual;
          else { this.selecionado = null; this.vista = 'amigos'; }
        }
        this.carregandoDados = false; this.dadosCarregados = true; this.cdr.markForCheck();
      }, error: err => { this.carregandoDados = false; this.mostrarErro(err, 'Não foi possível atualizar suas conexões.'); }
    });
  }
  alternarPermissao(chave: keyof SyncPermissions) {
    if (!this.conviteAtivo && !this.gerandoConvite) this.permissoes[chave] = !this.permissoes[chave];
  }
  gerarNovoConvite() {
    if (!this.email || this.gerandoConvite || this.conviteAtivo) return;
    this.gerandoConvite = true; this.mensagemErro = null; this.mensagemSucesso = null;
    this.syncService.criarConvite(this.permissoes).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: novo => {
        this.conviteAtivo = novo; this.permissoes = { ...novo.permissions };
        this.gerandoConvite = false; this.mostrarCodigo = false;
        if (this.conteudo) this.conteudo.nativeElement.scrollTop = 0;
        this.cdr.markForCheck();
      }, error: err => { this.gerandoConvite = false; this.mostrarErro(err, 'Não foi possível gerar o convite.'); }
    });
  }
  async copiarLink() {
    if (!this.conviteAtivo) return;
    try {
      if (navigator.clipboard) await navigator.clipboard.writeText(this.conviteAtivo.invite_url);
      else {
        const input = document.createElement('textarea'); input.value = this.conviteAtivo.invite_url;
        this.painel!.nativeElement.appendChild(input); input.select();
        const copiado = document.execCommand('copy'); input.remove();
        if (!copiado) throw new Error('copy');
      }
      if (this.destroyRef.destroyed) return;
      this.linkCopiado = true; clearTimeout(this.copiaTimer);
      this.copiaTimer = setTimeout(() => { this.linkCopiado = false; this.cdr.markForCheck(); }, 2500);
      this.cdr.markForCheck();
    } catch { this.mensagemErro = 'Não foi possível copiar. Abra “Ver código” para selecionar o link.'; this.cdr.markForCheck(); }
  }
  compartilharWhatsApp() {
    if (this.conviteAtivo) window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent('Vamos conectar nosso círculo musical no Tunify? ' + this.conviteAtivo.invite_url)}`, '_blank', 'noopener,noreferrer');
  }
  revogarConviteAtual() {
    if (!this.conviteAtivo || this.revogando) return;
    this.revogando = true;
    this.syncService.revogarConvite(this.conviteAtivo.invite_code).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.revogando = false; this.conviteAtivo = null; this.mensagemSucesso = 'Convite cancelado.'; this.carregarDadosIniciais(); },
      error: err => { this.revogando = false; this.mostrarErro(err, 'Não foi possível cancelar o convite.'); }
    });
  }
  abrirConviteRecebido() {
    let codigo = this.conviteRecebido.trim();
    try {
      if (/^https?:/i.test(codigo)) {
        const url = new URL(codigo);
        if (url.origin !== window.location.origin) throw new Error('origin');
        codigo = url.pathname.match(/^\/sync\/convite\/(vibe-[A-Za-z0-9]{1,12})\/?$/)?.[1] || '';
      }
      if (!/^vibe-[A-Za-z0-9]{1,12}$/.test(codigo)) throw new Error('code');
      this.fecharPainel(); this.router.navigate(['/sync/convite', codigo]);
    } catch { this.erroCodigo = 'Cole um código ou link de convite válido do Tunify.'; }
  }
}
