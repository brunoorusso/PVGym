import { Component, Input, OnInit } from '@angular/core';
import { AulaDisponivel, Aula } from '../aulas-disponiveis.service';
import { AulasService } from '../aulas.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-aula-descricao',
  templateUrl: './aula-descricao.component.html',
  styleUrls: ['./aula-descricao.component.css']
})

export class AulaDescricaoComponent implements OnInit {

  private aulasService: AulasService;

  @Input() aula: AulaDisponivel | undefined;
  @Input() aulas: Aula[] = [];
  public createComponent: boolean = false;

  constructor(aulasService: AulasService) {
    this.aulasService = aulasService;
  }

  ngOnInit(): void {

  }

  onCreateClick(): void {
    this.createComponent = true;
  }

  onSubmit(aulaForm: NgForm, aulaDisponivel: AulaDisponivel | undefined) {
    this.aulasService.createAulaForm(aulaForm.value, aulaDisponivel).subscribe(res => {
      aulaForm.reset();
    });
  }

}
