import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AulasDisponiveisService, AulaDisponivel, Aula } from '../aulas-disponiveis.service';
import { AulasService } from '../aulas.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-aulas-disponiveis',
  templateUrl: './aulas-disponiveis.component.html',
  styleUrls: ['./aulas-disponiveis.component.css']
})

export class AulasDisponiveisComponent implements OnInit {

  private aulasDisponiveisService: AulasDisponiveisService;
  private aulasService: AulasService;

  public aulasDisponiveis: AulaDisponivel[] = [];
  public aulas: Aula[] = [];
  public selectedAula: AulaDisponivel | undefined;

  constructor(aulasDisponiveisService: AulasDisponiveisService, aulasService: AulasService) {
    this.aulasDisponiveisService = aulasDisponiveisService;
    this.aulasService = aulasService;
    this.aulasDisponiveisService.getAvailableClasses().subscribe(aulasDisponiveis => this.aulasDisponiveis = aulasDisponiveis);
  }

  getAulas(aula: AulaDisponivel): void {
    this.selectedAula = aula;
    this.aulasService.getClasses(aula.name).subscribe(aulas => {
      this.aulas = aulas;
      console.log("aulas:" + this.aulas.length);
    },
      error => this.aulas = []
    );
    console.log(this.aulas.length);
  }

  ngOnInit(): void {
    
  }

}
