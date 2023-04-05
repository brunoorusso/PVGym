import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AulasDisponiveisComponent } from './aulas-disponiveis.component';

describe('AulasDisponiveisComponent', () => {
  let component: AulasDisponiveisComponent;
  let fixture: ComponentFixture<AulasDisponiveisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AulasDisponiveisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AulasDisponiveisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
