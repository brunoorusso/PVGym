/*
* Author: Bernardo Botelho
* Description: The StaffService is responsible for retrieving Staff objects from the API.
*/

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor(private http: HttpClient, @Inject("BASE_URL") private baseUrl: string) { }

  /**
   * Description: Returns an Observable of an array of all Staff objects from the API
   * Endpoint: GET '/api/Staff'
   * Returns: Observable of Staff[]
   */
  getStaffs(): Observable<Staff[]> {
    return this.http.get<Staff[]>(this.baseUrl + "api/Staff");
  }

  /**
   * Description: Returns an Observable of a single Staff object from the API
   * Endpoint: GET '/api/Staff/:id'
   * Params: id - number representing the ID of the desired Staff object
   * Returns: Observable of Staff
   */
  getStaff(id: number): Observable<Staff> {
    return this.http.get<Staff>(this.baseUrl + "api/Staff/" + id);
  }

  /**
   * Description: Returns an Observable of a single Staff object from the API, based on a given userId
   * Endpoint: GET '/api/Staff/UserId/:userId'
   * Params: userId - number representing the userId of the desired Staff object
   * Returns: Observable of Staff
   */
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
