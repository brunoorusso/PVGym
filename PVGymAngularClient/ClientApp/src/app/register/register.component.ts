import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserService } from '../user.service';
import { PlanType } from '../plan-type.enum';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  tipoOpcoes = [
    { id: PlanType.Normal, nome: "Normal" },
    { id: PlanType.Premium, nome: "Premium" }];


  constructor(public service: UserService) {
  }

  ngOnInit(): void {
    this.service.formModel.reset();
  }

  onSubmit() {
    this.service.register().subscribe();
    this.service.formModel.reset();
  }
}

 
