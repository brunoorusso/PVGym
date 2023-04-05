import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalEvaluationCreateComponent } from './physical-evaluation-create.component';

describe('PhysicalEvaluationCreateComponent', () => {
  let component: PhysicalEvaluationCreateComponent;
  let fixture: ComponentFixture<PhysicalEvaluationCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicalEvaluationCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhysicalEvaluationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
