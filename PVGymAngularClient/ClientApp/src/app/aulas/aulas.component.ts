import { Component, OnInit } from '@angular/core';
import { AulasService } from '../aulas.service';
import { AulaDisponivel, Aula } from '../aulas-disponiveis.service';
import { UserService } from '../user.service';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-aulas',
  templateUrl: './aulas.component.html',
  styleUrls: ['./aulas.component.css']
})
export class AulasComponent implements OnInit {

  public futureClassesMap: Map<string, Aula[]> = new Map<string, Aula[]>();
  public futureNameClassesMap: Map<string, Aula[]> = new Map<string, Aula[]>();
  public pastClassesMap: Map<string, Aula[]> = new Map<string, Aula[]>();
  public pastNameClassesMap: Map<string, Aula[]> = new Map<string, Aula[]>();

  constructor(public userService: UserService, public aulasService: AulasService) { }

  async ngOnInit(): Promise<void> {
    await this.getFutureClasses();
    await this.getPastClasses();
  }

  private onCompare(_left: KeyValue<any, any>, _right: KeyValue<any, any>): number {
    return -1;
  }

  async getFutureClasses(): Promise<void> {
    this.userService.getUserDataByEmail()?.subscribe(user => {
      this.aulasService.getMemberFutureClasses(user.id).subscribe(async futureClasses => {

        if (!futureClasses) {
          return;
        }

        for (let i = 0; i < futureClasses.length; i++) {
          let className = futureClasses[i].availableClassId || "";
          let classes = this.futureClassesMap.get(className) || [];
          classes.push(futureClasses[i]);
          this.futureClassesMap.set(className, classes);
        }

        const servicePromises: Promise<AulaDisponivel | undefined>[] = [];

        for (const [key, value] of this.futureClassesMap.entries()) {
          const promise = this.aulasService.getAvailableClassById(key).toPromise();
          servicePromises.push(promise);
        }

        const responses = await Promise.all(servicePromises);

        responses.forEach((response, index) => {
          const [key] = Array.from(this.futureClassesMap.keys())[index];
          this.futureNameClassesMap.set(response?.name || "", this.futureClassesMap.get(response?.id || "") || []);
        });

        console.log(this.futureNameClassesMap)
      });
    });
  }

  async getPastClasses(): Promise<void> {
    this.userService.getUserDataByEmail()?.subscribe(user => {
      this.aulasService.getMemberPastClasses(user.id).subscribe(async pastClasses => {

        if (!pastClasses) {
          return;
        }

        for (let i = 0; i < pastClasses.length; i++) {
          let className = pastClasses[i].availableClassId || "";
          let classes = this.pastClassesMap.get(className) || [];
          classes.push(pastClasses[i]);
          this.pastClassesMap.set(className, classes);
        }

        const servicePromises: Promise<AulaDisponivel | undefined>[] = [];

        for (const [key, value] of this.pastClassesMap.entries()) {
          const promise = this.aulasService.getAvailableClassById(key).toPromise();
          servicePromises.push(promise);
        }

        const responses = await Promise.all(servicePromises);

        responses.forEach((response, index) => {
          const [key] = Array.from(this.pastClassesMap.keys())[index];
          this.pastNameClassesMap.set(response?.name || "", this.pastClassesMap.get(response?.id || "") || []);
        });

        console.log(this.pastNameClassesMap)
      });
    });
  }

}
