import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { SyncCardComponent } from './sync-card.component';
import { SyncService } from '../../core/services/sync.service';

const permissions = {share_minutes: true, share_top_tracks: false, share_top_artists: true, share_peak_time: false};
describe('Gerenciamento das conexões', () => {
  beforeEach(() => {
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {configurable:true, value:function() { this.setAttribute('open',''); }});
    Object.defineProperty(HTMLDialogElement.prototype, 'close', {configurable:true, value:function() { this.removeAttribute('open'); }});
  });
  afterEach(() => { TestBed.resetTestingModule(); vi.useRealTimers(); document.body.style.overflow = ''; });
  it('remove o link usado na atualização e salva somente a seleção do próprio usuário', () => {
    const service = {
      listarMeusConvitesAtivos: vi.fn().mockReturnValueOnce(of([{invite_code: 'vibe-abc', permissions}])).mockReturnValue(of([])),
      listarConexoes: vi.fn().mockReturnValue(of([])),
      atualizarPermissoes: vi.fn().mockReturnValue(of({}))
    };
    TestBed.configureTestingModule({imports: [SyncCardComponent], providers: [provideRouter([]), {provide: SyncService, useValue: service}]});
    const fixture = TestBed.createComponent(SyncCardComponent);
    fixture.componentInstance.email = 'alice@test.com';
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component.alternarPermissao('share_minutes');
    expect(component.permissoes.share_minutes).toBe(true);
    component.carregarDadosIniciais();
    expect(component.conviteAtivo).toBeNull();
    component.editarPermissoes({connection_id: 7, minhas_permissoes_para_ele: permissions} as any);
    component.permissoesEdicao!.share_minutes = false;
    component.salvarPermissoes();
    expect(service.atualizarPermissoes).toHaveBeenCalledWith(7, {...permissions, share_minutes: false});
    expect(permissions.share_minutes).toBe(true);
    fixture.destroy();
  });
  function preparar() {
    const friends = [
      {connection_id:1,amigo:{id:1,nome:'Ana Lima'},minhas_permissoes_para_ele:permissions,permissoes_dele_para_mim:{...permissions,share_minutes:false,share_top_artists:false}},
      {connection_id:2,amigo:{id:2,nome:'Bruno Dias'},minhas_permissoes_para_ele:{...permissions,share_minutes:false,share_top_artists:false},permissoes_dele_para_mim:permissions}
    ];
    const service = {listarMeusConvitesAtivos:vi.fn().mockReturnValue(of([])), listarConexoes:vi.fn().mockReturnValue(of(friends)), desconectar:vi.fn().mockReturnValue(of(null))};
    TestBed.configureTestingModule({imports:[SyncCardComponent],providers:[provideRouter([]),{provide:SyncService,useValue:service}]});
    const fixture=TestBed.createComponent(SyncCardComponent);
    fixture.componentInstance.email='alice@test.com'; fixture.detectChanges();
    return {fixture, component:fixture.componentInstance, service, friends};
  }
  it('separa filtros de quem vê meus dados e de quem compartilha comigo', () => {
    const {component}=preparar();
    component.filtro='veem'; expect(component.conexoesFiltradas.map(c=>c.amigo.nome)).toEqual(['Ana Lima']);
    component.filtro='compartilham'; expect(component.conexoesFiltradas.map(c=>c.amigo.nome)).toEqual(['Bruno Dias']);
    component.filtro='todos'; component.busca='ANA'; expect(component.conexoesFiltradas).toHaveLength(1);
  });
  it('abre em conexões e restaura rolagem ao fechar, inclusive por Esc', () => {
    vi.useFakeTimers();
    const {fixture,component}=preparar();
    document.body.style.overflow='auto'; component.abrirPainel();
    expect(component.vista).toBe('amigos'); expect(document.body.style.overflow).toBe('hidden');
    const event=new Event('cancel',{cancelable:true}); fixture.nativeElement.querySelector('dialog').dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true); vi.advanceTimersByTime(250);
    expect(component.painelAberto).toBe(false); expect(document.body.style.overflow).toBe('auto');
  });
  it('mantém o carrossel vivo, pausa ao interagir e remove os temporizadores ao sair', () => {
    vi.useFakeTimers(); const {fixture,component}=preparar();
    vi.advanceTimersByTime(6000); expect(component.slide).toBe(1);
    component.pausado=true; vi.advanceTimersByTime(6000); expect(component.slide).toBe(1);
    component.pausado=false; component.abrirPainel(); vi.advanceTimersByTime(6000); expect(component.slide).toBe(1);
    fixture.destroy(); expect(vi.getTimerCount()).toBe(0); expect(document.body.style.overflow).toBe('');
  });
  it('exige confirmação antes de desconectar', () => {
    const {component,service,friends}=preparar();
    component.desconectar(friends[0] as any); expect(service.desconectar).not.toHaveBeenCalled();
    component.confirmarDesconexao=true; component.desconectar(friends[0] as any); expect(service.desconectar).toHaveBeenCalledWith(1);
  });
  it('valida convites colados sem aceitar destinos externos', () => {
    const {component}=preparar();
    component.conviteRecebido='https://example.com/sync/convite/vibe-abc'; component.abrirConviteRecebido();
    expect(component.erroCodigo).toContain('válido');
  });
  it('exibe foto do amigo conectado e até 5 avatares no card fechado com 3 telinhas', () => {
    const umAmigo = [{connection_id:1, amigo:{id:2, nome:'Ainoã Raquel', foto_perfil:'https://i.scdn.co/image/ainoa'}, minhas_permissoes_para_ele:permissions, permissoes_dele_para_mim:permissions}];
    const seisAmigos = [1,2,3,4,5,6].map(id => ({connection_id:id, amigo:{id, nome:`Amigo ${id}`, foto_perfil:`https://i.scdn.co/image/${id}`}, minhas_permissoes_para_ele:permissions, permissoes_dele_para_mim:permissions}));
    const service = {
      listarMeusConvitesAtivos: vi.fn().mockReturnValue(of([])),
      listarConexoes: vi.fn().mockReturnValueOnce(of(umAmigo)).mockReturnValueOnce(of(seisAmigos))
    };
    TestBed.configureTestingModule({imports:[SyncCardComponent],providers:[provideRouter([]),{provide:SyncService,useValue:service}]});
    const fixture = TestBed.createComponent(SyncCardComponent);
    fixture.componentInstance.email = 'alice@test.com';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.sync-tile .slide')).toHaveLength(3);
    expect(fixture.nativeElement.querySelector('.single-friend-showcase img')?.getAttribute('src')).toBe('https://i.scdn.co/image/ainoa');
    expect(fixture.nativeElement.querySelector('.single-friend-showcase .texto-especial')?.textContent).toContain('Ainoã Raquel');
    fixture.componentInstance.carregarDadosIniciais();
    fixture.detectChanges();
    expect(fixture.componentInstance.amigosVisiveis).toHaveLength(5);
    expect(fixture.componentInstance.amigosExtras).toBe(1);
    expect(fixture.nativeElement.querySelector('.dock-extra')?.textContent).toContain('+1');
  });
});
