import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  /*
   * Autor: Bernardo Botelho
   */

  constructor(private http: HttpClient, @Inject("BASE_URL") private baseUrl: string) { }

  getStaffs(): Observable<Staff[]> {
    return this.http.get<Staff[]>(this.baseUrl + "api/Staff");
  }

  getStaff(id: number): Observable<Staff> {
    return this.http.get<Staff>(this.baseUrl + "api/Staff/" + id);
  }

  getStaffByUserId(userId: number): Observable<Staff> {
    return this.http.get<Staff>(this.baseUrl + "api/Staff/UserId/" + userId);
  }
}

export interface Staff {
  id: number;
  specialization: string;
  isAdmin: boolean;
  userId: number;
}
