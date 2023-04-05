import { TestBed } from '@angular/core/testing';

import { AulasDisponiveisService } from './aulas-disponiveis.service';

describe('AulasDisponiveisService', () => {
  let service: AulasDisponiveisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AulasDisponiveisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
