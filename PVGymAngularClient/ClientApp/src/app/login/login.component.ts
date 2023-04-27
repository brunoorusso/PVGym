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

  ngOnInit(): void {
    this.service.loginFormModel.reset();
    
  }

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
