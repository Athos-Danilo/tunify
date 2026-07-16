import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReproducoesRecentes } from './reproducoes-recentes';

describe('ReproducoesRecentes', () => {
  let component: ReproducoesRecentes;
  let fixture: ComponentFixture<ReproducoesRecentes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReproducoesRecentes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReproducoesRecentes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
