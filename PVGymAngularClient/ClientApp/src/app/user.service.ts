/*
   *  Author: Bruno Russo
   *  Co-author: Bernardo Botelho
   *  Description: This service provides methods for handling user-related tasks in a web-app.
   *  It includes methods for registering, logging in, logging out, updating user data, and checking if the user is logged in.
   */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable, switchMap, throwError } from 'rxjs';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  
  private roles: string[] = [];
  passwordError = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {

  }

  readonly BaseURI = 'https://localhost:7023/api'

  formModel = this.fb.group({
    userName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    VAT: ['', Validators.required],
    confirmPassword: ['', Validators.required],
    planType: ['', Validators.required]
  });

  loginFormModel = this.fb.group({
    Email: ['', Validators.required],
    Password: ['', Validators.required]
  });

  staffFormModel = this.fb.group({
    userName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
    specialization: ['', Validators.required],
    administrator: ['', Validators.required]
  });

  /*
   * Register method
   * This method allow us to register a new member in the database.
   * In this method, after a new user is created, a new member is also created in the database.
   */
  register() {
    var user = {
      UserName: this.formModel.value.userName,
      Email: this.formModel.value.email,
      Password: this.formModel.value.password,
      ConfirmPassword: this.formModel.value.confirmPassword
    };

    var member = {
      VAT: this.formModel.value.VAT,
      planType: this.formModel.value.planType === 'normal' ? 0 : 1
    };

    if (user.Password !== user.ConfirmPassword) {
      return throwError("Passwords not the same");
    }

    return this.http.post(this.BaseURI + '/ApplicationUser/Register', user).pipe(
      map((result: any) => {
        const memberData = { VAT: member.VAT, PlanType: member.planType, UserId: result.id }; // criar objeto com dados do membro e ID do usuário
        return memberData;
      }),
      switchMap((memberData: any) => {
        return this.http.post(this.BaseURI + '/Member', memberData); // fazer chamada para criar o membro
      })
    );

  }

  /*
   * Add Staff Method
   * This method allow us to register a new member in the database.
   * In this method, after a new user is created, a new staff is also created in the database.
   */
  addStaff() {
    var user = {
      UserName: this.staffFormModel.value.userName,
      Email: this.staffFormModel.value.email,
      Password: this.staffFormModel.value.password,
      ConfirmPassword: this.staffFormModel.value.confirmPassword
    };

    var staff = {
      Specialization: this.staffFormModel.value.specialization,
      Administrator: this.staffFormModel.value.administrator ? true : false
    };

    if (user.Password !== user.ConfirmPassword) {
      return throwError("Passwords not the same");
    }

    return this.http.post(this.BaseURI + '/ApplicationUser/Register', user).pipe(
      map((result: any) => {
        const staffData = { Specialization: staff.Specialization, IsAdmin: staff.Administrator, UserId: result.id }; // criar objeto com dados do membro e ID do usuário
        return staffData;
      }),
      switchMap((staffData: any) => {
        return this.http.post(this.BaseURI + '/Staff', staffData); // fazer chamada para criar o membro
      })
    );

  }

  /*
   * Update User Method
   * This method allow a user to update his personal data like username and password.
   */ 
  updateUser() {

    var user = {
      UserName: this.formModel.value.userName,
      Email: this.formModel.value.email,
      Password: this.formModel.value.password,
      ConfirmPassword: this.formModel.value.confirmPassword
    };

    if (user.Password !== user.ConfirmPassword) {
      this.passwordError = true;
    }

    const token = localStorage.getItem('token');  
    if (token) {
      const decodedToken: any = jwt_decode(token);
      return this.http.put(this.BaseURI + '/ApplicationUser/UpdateUser/' + decodedToken.sub, user);
    }

    return null;
  }


  /*
   * Login Method
   * This method allow a user to login in the web-app.
   */ 
  login() {
    var user = {
      Email: this.loginFormModel.value.Email,
      Password: this.loginFormModel.value.Password
    }

    return this.http.post(this.BaseURI + '/ApplicationUser/Login', user);
  }

  /*
   * Logout Method
   * This method allow a user to logout in the web-app.
   * This logout is done by removing the token associate to the user when he logs in.
   */ 
  logout() {
    localStorage.removeItem('token');
  }

  /*
   * Logged In Method
   * This method check if a user is logged in the web-app.
   */ 
  isLoggedIn(): boolean {
    if (localStorage.getItem('token')) {
      return true;
    }
    return false;
  }

  /*
   * Is Admin Method
   * This method check if the user logged in the web-app is an admin.
   */ 
  isAdmin() {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken: any = jwt_decode(token);
      const roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      if (roles.includes("admin")) {

        return true;
      }
    }

    return false;
  }

  /*
   * Is Member Method
   * This method check if the user logged in the web-app is a member.
   */ 
  isMember() {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken: any = jwt_decode(token);
      const roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      if (roles.includes("member")) {
        return true;
      }
    }

    return false;
  }

  /*
   * Is Staff Method
   * This method check if the user logged in the web-app is a staff.
   */ 
  isStaff() {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken: any = jwt_decode(token);
      const roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      if (roles.includes("staff")) {
        return true;
      }
    }

    return false;
  }

  getUserData(): Observable<any[]> {
    return this.http.get<any[]>(this.BaseURI + '/ApplicationUser/GetAllUsers');
  }

  /* Get User Data By Email Method
   * This method return the user data by email.
   * This email can be provided as parameter or can be obtained from the token, to get the data from current logged in user.
   */
  getUserDataByEmail(email?: string) {
    if (email) {
      return this.http.get<any>(this.BaseURI + `/ApplicationUser/GetUserByEmail/${email}`);
    } else {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken: any = jwt_decode(token);
        return this.http.get<any>(this.BaseURI + `/ApplicationUser/GetUserByEmail/${decodedToken.sub}`);
      }
      return null;
    }
  }


  /* Get Staff By Id
   * This method return the staff data by id.
   */ 
  getStaffById(id: string) {
    return this.http.get<any[]>(this.BaseURI + `/Staff/UserId/${id}`);
  }

  /* Get User By Id
   * This method return the user data by id.
   */
  getUser(id: number): Observable<ApplicationUserModel> {
    return this.http.get<ApplicationUserModel>(this.BaseURI + `/ApplicationUser/GetUser/${id}`);
  }

}

export interface ApplicationUserModel {
  userName: string;
  email: string;
  password: string;
}
