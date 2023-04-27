/*
 * Author: Bruno Russo
 * Description: This component is responsible for the add member page.
 * It uses the user service by injection to register a new member.
 */ 
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserService } from '../user.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(public service: UserService) {
  }

  /*
   * On Init Method
   * When the component is initialized, the associated formModel is reseted.
   * The field planType is set to normal by default.
   */ 
  ngOnInit(): void {
    this.service.formModel.reset();
    this.service.formModel.get('planType')?.setValue('normal');
    
  }

  /*
   * On Submit Method
   * When the form is submitted, the register method of the user service is called.
   * After that, the associated formModel is reseted.
   */ 
  onSubmit() {
    this.service.register().subscribe();
    this.service.formModel.reset();
  }
}

 
