import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable, switchMap, throwError } from 'rxjs';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

  /*
   *  Autor: Bruno Russo 202001410
   */
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

  confirmPassword(password: string, confirmPassword: string) {
    return password === confirmPassword ? true : false;
  }

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

  login() {
    var user = {
      Email: this.loginFormModel.value.Email,
      Password: this.loginFormModel.value.Password
    }

    return this.http.post(this.BaseURI + '/ApplicationUser/Login', user);
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    if (localStorage.getItem('token')) {
      return true;
    }
    return false;
  }

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

  getUserDataByEmail() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwt_decode(token);
      return this.http.get<any>(this.BaseURI + `/ApplicationUser/GetUserByEmail/${decodedToken.sub}`);
    }
    return null;
  }

  getStaffById(id: string) {
    return this.http.get<any[]>(this.BaseURI + `/Staff/GetStaffByUserId/${id}`);
  }
  getUser(id: number): Observable<ApplicationUserModel> {
    return this.http.get<ApplicationUserModel>(this.BaseURI + `/ApplicationUser/GetUser/${id}`);
  }

}

export interface ApplicationUserModel {
  userName: string;
  email: string;
  password: string;
}
