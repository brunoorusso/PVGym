/*
 * Autor: Alexandre Oliveira
 */

import { Component, OnInit } from '@angular/core';
import { AulasDisponiveisService, AulaDisponivel, Aula } from '../aulas-disponiveis.service';
import { AulasService } from '../aulas.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-aulas-disponiveis',
  templateUrl: './aulas-disponiveis.component.html',
  styleUrls: ['./aulas-disponiveis.component.css']
})

export class AulasDisponiveisComponent implements OnInit {

  private aulasDisponiveisService: AulasDisponiveisService;
  private aulasService: AulasService;
  private userService: UserService;

  public aulasDisponiveis: AulaDisponivel[] = [];
  public aulas: Aula[] = [];
  public selectedAula: AulaDisponivel | undefined;
  public isInClass: Map<string, boolean> = new Map<string, boolean>();

  /*
   * AulasDisponiveisComponent constructor
   * Initializes all services and gets available classes using AulasDisponiveisService
   * Populates "aulasDisponiveis" array
   */
  constructor(aulasDisponiveisService: AulasDisponiveisService, aulasService: AulasService, userService: UserService) {
    this.aulasDisponiveisService = aulasDisponiveisService;
    this.aulasService = aulasService;
    this.userService = userService;
    this.aulasDisponiveisService.getAvailableClasses().subscribe(aulasDisponiveis => this.aulasDisponiveis = aulasDisponiveis);
  }

  /*
   * getAulas Method
   * Gets all classes for a selected AulaDisponivel and indicates which classes the user is in.
   * Populates "aulas" array and "isInClass" map.
   */
  getAulas(aula: AulaDisponivel): void {
    this.selectedAula = aula;
    this.aulasService.getClasses(aula.name).subscribe(aulas => {
      this.userService.getUserDataByEmail()?.subscribe(user => {
        this.aulas = aulas;
        if (this.aulas) {
          for (var aula of this.aulas) {
            for (let j = 0; j < aula.members.length; j++) {
              if (aula.members[j].userId == user.id) {
                this.isInClass.set(aula.id, true);
                break;
              }
            }
            if (!this.isInClass.has(aula.id)) {
              this.isInClass.set(aula.id, false);
            }
          }
        } else {
          this.aulas = [];
        }
      });
    });
  }

  /*
   * populateInClassMap Method
   * Populates a map that indicates which classes the user is in.
   * Populates "isInClass" map on component initialization.
   */
  populateInClassMap() {
    this.userService.getUserDataByEmail()?.subscribe(user => {
      for (var aula of this.aulas) {
        for (let j = 0; j < aula.members.length; j++) {
          if (aula.members[j].userId == user.id) {
            this.isInClass.set(aula.id, true);
            break;
          }
        }
        if (!this.isInClass.has(aula.id)) {
          this.isInClass.set(aula.id, false);
        }
      }
    });
  }

  ngOnInit(): void {
    this.populateInClassMap();
  }

}
