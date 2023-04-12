import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable, switchMap } from 'rxjs';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private roles: string[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {
   
  }

  readonly BaseURI = 'https://localhost:7023/api'

  formModel = this.fb.group({
    userName: ['', Validators.required],
    email: ['', Validators.email],
    password: ['', Validators.required],
    VAT: ['', Validators.required],
  });

  loginFormModel = this.fb.group({
    Email: ['', Validators.required],
    Password: ['', Validators.required]
  })

  staffFormModel = this.fb.group({
    UserName: ['', Validators.required],
    Email: ['', Validators.email],
    Password: ['', Validators.required],
    Specialization: ['', Validators.required],
    Administrator: ['', Validators.required]
    })

  register() {
    var user = {
      UserName: this.formModel.value.userName,
      Email: this.formModel.value.email,
      Password: this.formModel.value.password
    };

    var member = {
      VAT: this.formModel.value.VAT,
      //PlanType: this.formModel.value.PlanType 
    };


    return this.http.post(this.BaseURI + '/ApplicationUser/Register', user).pipe(
      map((result: any) => {
        const memberData = { VAT: member.VAT, UserId: result.id }; // criar objeto com dados do membro e ID do usuário
        return memberData;
      }),
      switchMap((memberData: any) => {
        return this.http.post(this.BaseURI + '/Member', memberData); // fazer chamada para criar o membro
      })
    );
  }

  addStaff() {
    var user = {
      UserName: this.staffFormModel.value.UserName,
      Email: this.staffFormModel.value.Email,
      Password: this.staffFormModel.value.Password
    };

    var staff = {
      Specialization: this.staffFormModel.value.Specialization,
      Administrator: this.staffFormModel.value.Administrator ? true : false
    };

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
      Password: this.formModel.value.password
    };
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

  isLoggedIn() : boolean{
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
      return this.http.get<any[]>(this.BaseURI + `/ApplicationUser/GetUserByEmail/${decodedToken.sub}`);
    }
    return null;
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
