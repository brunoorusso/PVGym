import { Component, OnInit } from '@angular/core';
import { Aula } from '../aulas-disponiveis.service';

@Component({
  selector: 'app-aulas',
  templateUrl: './aulas.component.html',
  styleUrls: ['./aulas.component.css']
})
export class AulasComponent implements OnInit {

  public aulas: Aula[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
