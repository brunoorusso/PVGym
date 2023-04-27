import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserService } from '../user.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  /*
   * Autor: Bruno Russo
   */

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

 
