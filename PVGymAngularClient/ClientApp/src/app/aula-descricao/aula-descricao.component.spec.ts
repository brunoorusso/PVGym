import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AulaDescricaoComponent } from './aula-descricao.component';

describe('AulaDescricaoComponent', () => {
  let component: AulaDescricaoComponent;
  let fixture: ComponentFixture<AulaDescricaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AulaDescricaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AulaDescricaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
