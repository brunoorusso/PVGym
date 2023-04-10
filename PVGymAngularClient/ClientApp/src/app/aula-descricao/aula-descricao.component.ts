import { Component, Input, OnInit } from '@angular/core';
import { AulaDisponivel, Aula } from '../aulas-disponiveis.service';
import { AulasService } from '../aulas.service';


@Component({
  selector: 'app-aula-descricao',
  templateUrl: './aula-descricao.component.html',
  styleUrls: ['./aula-descricao.component.css']
})

export class AulaDescricaoComponent implements OnInit {

  private aulasService: AulasService;

  @Input() aula: AulaDisponivel | undefined;
  public aulas: Aula[] = [];

  constructor(aulasService: AulasService) {
    this.aulasService = aulasService;
    if (this.aula != null) {
      this.aulasService.getClasses(this.aula.name).subscribe(aulas => this.aulas = aulas);
      
    }
    console.log("aqui")
    console.log(this.aulas.length)
  }

  ngOnInit(): void {
  }

}
