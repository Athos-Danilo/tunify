import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerContainer } from './player-container.component';

describe('PlayerContainer', () => {
  let component: PlayerContainer;
  let fixture: ComponentFixture<PlayerContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
