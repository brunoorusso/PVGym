import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AulasDisponiveisService } from '../aulas-disponiveis.service';
import { AulaDisponivel } from '../aulas-disponiveis';

@Component({
  selector: 'app-aulas-disponiveis',
  templateUrl: './aulas-disponiveis.component.html',
  styleUrls: ['./aulas-disponiveis.component.css']
})

export class AulasDisponiveisComponent implements OnInit {

  private aulasDisponiveisService: AulasDisponiveisService;

  public aulasDisponiveis: AulaDisponivel[] = [];

  constructor(aulasDisponiveisService: AulasDisponiveisService,) {
    this.aulasDisponiveisService = aulasDisponiveisService;
    this.aulasDisponiveisService.getAvailableClasses().subscribe(aulasDisponiveis => this.aulasDisponiveis = aulasDisponiveis);
  }

  ngOnInit(): void {
  }

}
