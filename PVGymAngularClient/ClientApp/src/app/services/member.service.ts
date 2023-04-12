import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evaluation } from '../physical-evaluation/physical-evaluation.component';
import { PlanType } from '../plan-type.enum';
import { Plan } from '../treinos.service';
import { ApplicationUserModel } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor(private http: HttpClient, @Inject("BASE_URL") private baseUrl: string) { }

  getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.baseUrl + "api/Member");
  }

  getMember(id: number): Observable<Member> {
    return this.http.get<Member>(this.baseUrl + "api/Member/" + id);
  }

  getMemberByUserId(userId: number): Observable<Member> {
    return this.http.get<Member>(this.baseUrl + "api/Member/UserId/" + userId);
  }
}

export interface Member {
  memberId: number;
  vat: number;
  planType: PlanType;
  plans: Plan[];
  evaluations: Evaluation[];
  userId: number;
  user: ApplicationUserModel;
}
