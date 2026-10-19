import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { SyncCardComponent } from './sync-card.component';
import { SyncService } from '../../core/services/sync.service';

const permissions = {share_minutes: true, share_top_tracks: false, share_top_artists: true, share_peak_time: false};
describe('Gerenciamento das conexões', () => {
  afterEach(() => TestBed.resetTestingModule());
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
});
