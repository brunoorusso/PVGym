import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalEvaluationComponent } from './physical-evaluation.component';

describe('PhysicalEvaluationComponent', () => {
  let component: PhysicalEvaluationComponent;
  let fixture: ComponentFixture<PhysicalEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicalEvaluationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhysicalEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
