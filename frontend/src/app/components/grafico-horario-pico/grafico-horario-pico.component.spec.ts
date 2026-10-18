import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HistorySyncService } from '../../core/services/history-sync.service';
import { SpotifyService } from '../../core/services/spotify.service';
import { GraficoHorarioPicoComponent } from './grafico-horario-pico.component';

const response = (periodos: Record<string, number>) => ({ periodos });

describe('Horário de Pico', () => {
  let service: { getPeakTime: ReturnType<typeof vi.fn> };
  beforeEach(async () => {
    service = { getPeakTime: vi.fn() };
    localStorage.setItem('tunify_user_info', JSON.stringify({email:'audit@test'}));
    await TestBed.configureTestingModule({
      imports: [GraficoHorarioPicoComponent],
      providers: [{provide:HistorySyncService,useValue:service}]
    }).compileComponents();
  });
  afterEach(() => { localStorage.removeItem('tunify_user_info'); TestBed.resetTestingModule(); });
  it('exibe empate sem escolher um vencedor arbitrário', () => {
    service.getPeakTime.mockReturnValue(of(response({madrugada:10,manha:10,tarde:0,noite:0})));
    const fixture = TestBed.createComponent(GraficoHorarioPicoComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.dominantes).toEqual(['madrugada','manha']);
    expect(fixture.componentInstance.listaPeriodos.map(p=>p.porcentagem)).toEqual([50,50,0,0]);
    expect(fixture.nativeElement.textContent).toContain('empatados');
    expect(fixture.nativeElement.querySelectorAll('.vencedor').length).toBe(2);
  });
  it('limpa vencedor e total quando uma nova consulta fica vazia', () => {
    service.getPeakTime.mockReturnValueOnce(of(response({madrugada:0,manha:0,tarde:8,noite:0})))
      .mockReturnValueOnce(of(response({madrugada:0,manha:0,tarde:0,noite:0})));
    const fixture = TestBed.createComponent(GraficoHorarioPicoComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.dominanteInfo.nome).toBe('Tarde');
    fixture.componentInstance.carregarDados();
    fixture.detectChanges();
    expect(fixture.componentInstance.dominanteInfo).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Nenhuma reprodução registrada');
  });
  it('recupera a exibição após erro e nova consulta', () => {
    service.getPeakTime.mockReturnValueOnce(throwError(()=>new Error('offline')))
      .mockReturnValueOnce(of(response({madrugada:0,manha:1,tarde:0,noite:0})));
    const fixture = TestBed.createComponent(GraficoHorarioPicoComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.erro).not.toBeNull();
    fixture.componentInstance.carregarDados();
    fixture.detectChanges();
    expect(fixture.componentInstance.erro).toBeNull();
    expect(fixture.componentInstance.totalPlays).toBe(1);
  });
});

describe('Consulta de Horário de Pico', () => {
  beforeEach(() => TestBed.configureTestingModule({providers:[provideHttpClient(),provideHttpClientTesting(),{provide:SpotifyService,useValue:{}}]}));
  afterEach(() => { TestBed.inject(HttpTestingController).verify(); TestBed.resetTestingModule(); });
  it('consulta novamente ao reabrir e não compartilha dados entre contas', () => {
    const service=TestBed.inject(HistorySyncService);
    const http=TestBed.inject(HttpTestingController);
    for (const email of ['a@test','a@test','b@test']) {
      let received: any;
      service.getPeakTime(email).subscribe(value=>received=value);
      const req=http.expectOne(r=>r.url.endsWith('/peak-time/'+encodeURIComponent(email)));
      req.flush({user:email});
      expect(received.user).toBe(email);
    }
  });
});
