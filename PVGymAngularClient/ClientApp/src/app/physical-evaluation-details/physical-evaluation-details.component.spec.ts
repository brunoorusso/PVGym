import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalEvaluationDetailsComponent } from './physical-evaluation-details.component';

describe('PhysicalEvaluationDetailsComponent', () => {
  let component: PhysicalEvaluationDetailsComponent;
  let fixture: ComponentFixture<PhysicalEvaluationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicalEvaluationDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhysicalEvaluationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
