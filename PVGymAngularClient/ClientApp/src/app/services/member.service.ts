/*
* Author: Bernardo Botelho
* Description: The MemberService is responsible for retrieving Member objects from the API.
* The service provides methods for retrieving a list of all Members, retrieving a single Member by ID,
* and retrieving a single Member by user ID.
*/

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evaluation } from '../physical-evaluation/physical-evaluation.component';
import { Plan } from '../services/treinos.service';
import { ApplicationUserModel } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor(private http: HttpClient, @Inject("BASE_URL") private baseUrl: string) { }

  /**
   * Description: Returns an Observable of an array of Member objects from the API
   * Endpoint: GET '/api/Member'
   * Returns: Observable of Member[]
   */
  getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.baseUrl + "api/Member");
  }

  /**
   * Description: Returns an Observable of a single Member object from the API
   * Endpoint: GET '/api/Member/:id'
   * Params: id - number representing the ID of the desired Member object
   * Returns: Observable of Member
   */
  getMember(id: number): Observable<Member> {
    return this.http.get<Member>(this.baseUrl + "api/Member/" + id);
  }

  /**
   * Description: Returns an Observable of a single Member object from the API, given the user ID
   * Endpoint: GET '/api/Member/UserId/:userId'
   * Params: userId - number representing the user ID of the desired Member object
   * Returns: Observable of Member
   */
  getMemberByUserId(userId: number): Observable<Member> {
    return this.http.get<Member>(this.baseUrl + "api/Member/UserId/" + userId);
  }
}

export interface Member {
  memberId: number;
  vat: number;
  planType: string;
  plans: Plan[];
  evaluations: Evaluation[];
  userId: number;
  user: ApplicationUserModel;
}
