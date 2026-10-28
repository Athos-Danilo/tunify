import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { ConviteSyncComponent } from './convite-sync.component';
import { AuthService } from '../../core/services/auth.service';
import { SyncService } from '../../core/services/sync.service';

describe('Página de convite', () => {
  afterEach(() => TestBed.resetTestingModule());
  it('mostra a razão quando um convite não está disponível', () => {
    TestBed.configureTestingModule({ imports: [ConviteSyncComponent], providers: [
      provideRouter([]),
      {provide: ActivatedRoute, useValue: {snapshot: {paramMap: new Map([['codigo', 'vibe-abc']])}}},
      {provide: AuthService, useValue: {estaLogado: () => false}},
      {provide: SyncService, useValue: {obterDetalhesConvite: () => of({is_valid: false, message: 'Este convite expirou.'})}}
    ] });
    const fixture = TestBed.createComponent(ConviteSyncComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Este convite expirou.');
  });

  function pagina(details: Record<string, unknown>, aceitar = vi.fn()) {
    TestBed.configureTestingModule({ imports: [ConviteSyncComponent], providers: [
      provideRouter([]),
      {provide: ActivatedRoute, useValue: {snapshot: {paramMap: new Map([['codigo', 'vibe-abc']])}}},
      {provide: AuthService, useValue: {estaLogado: () => true, obterIdentidade: () => of({email: 'bob@test.com', nome: 'Bob'})}},
      {provide: SyncService, useValue: {obterDetalhesConvite: () => of({
        sender: {nome: 'Alice'}, is_valid: true, is_owner: false, is_already_connected: false,
        permissions: {}, ...details
      }), aceitarConvite: aceitar}}
    ] });
    const fixture = TestBed.createComponent(ConviteSyncComponent);
    fixture.detectChanges();
    return fixture;
  }

  it.each([true, false])('mostra somente a conexão existente, mesmo com convite válido=%s', (valid) => {
    const aceitar = vi.fn();
    const fixture = pagina({is_already_connected: true, is_valid: valid}, aceitar);
    expect(fixture.nativeElement.textContent).toContain('Vocês já estão conectados!');
    expect(fixture.nativeElement.querySelector('.main-invite-card')).toBeNull();
    expect(fixture.nativeElement.querySelector('.error-card')).toBeNull();
    fixture.componentInstance.aceitarConexao();
    expect(aceitar).not.toHaveBeenCalled();
  });

  it('trata conexão criada em outra aba depois de carregar a página como conexão ativa', () => {
    const fixture = pagina({}, vi.fn().mockReturnValue(throwError(() => ({status: 409}))));
    fixture.componentInstance.aceitarConexao();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Vocês já estão conectados!');
    expect(fixture.nativeElement.querySelector('.main-invite-card')).toBeNull();
    expect(fixture.nativeElement.querySelector('.error-card')).toBeNull();
  });

  it('não mantém formulário de sincronização junto de um erro', () => {
    const fixture = pagina({}, vi.fn().mockReturnValue(throwError(() => ({status: 410}))));
    fixture.componentInstance.aceitarConexao();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.error-card')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.main-invite-card')).toBeNull();
  });
});
