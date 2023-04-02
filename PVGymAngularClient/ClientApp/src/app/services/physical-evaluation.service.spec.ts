import { TestBed } from '@angular/core/testing';

import { PhysicalEvaluationService } from './physical-evaluation.service';

describe('PhysicalEvaluationService', () => {
  let service: PhysicalEvaluationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhysicalEvaluationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
