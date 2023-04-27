/*
 * Author: Bruno Russo
 * Description: This component is responsible for the login page.
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginError = false;

  constructor(public service: UserService, private router: Router) { }

  /*
   * ngOnInit method
   * When the component is initialized, the login form is reseted.
   */ 
  ngOnInit(): void {
    this.service.loginFormModel.reset();
  }

  /*
   * onSubmit method
   * When the user submits the login form, the login method is called.
   * If the login is sucessfull, a token is assigned to the user.
   */ 
  onSubmit() {
    this.service.login().subscribe(
      (result: any) => {
        const token = result['token'];
        localStorage.setItem('token', token);
        this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
      },
      (error) => {
        this.loginError = true;
      }
    );
  }
}
