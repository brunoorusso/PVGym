import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AulasDisponiveisService, AulaDisponivel } from '../aulas-disponiveis.service';
/*import { AulaDisponivel } from '../aulas-disponiveis';*/
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-aulas-disponiveis',
  templateUrl: './aulas-disponiveis.component.html',
  styleUrls: ['./aulas-disponiveis.component.css']
})

export class AulasDisponiveisComponent implements OnInit {

  private aulasDisponiveisService: AulasDisponiveisService;

  public aulasDisponiveis: AulaDisponivel[] = [];
  public selectedAula: AulaDisponivel | undefined;

  constructor(aulasDisponiveisService: AulasDisponiveisService,) {
    this.aulasDisponiveisService = aulasDisponiveisService;
    this.aulasDisponiveisService.getAvailableClasses().subscribe(aulasDisponiveis => this.aulasDisponiveis = aulasDisponiveis);
  }

  ngOnInit(): void {
    
  }

}
