import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evaluation } from '../physical-evaluation/physical-evaluation.component';


@Injectable({
  providedIn: 'root'
})
export class PhysicalEvaluationService {

  constructor(private http: HttpClient, @Inject("BASE_URL") private baseUrl: string) { }

  getPhysicalEvaluations(): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(this.baseUrl + "api/Evaluation");
  }

  getPhysicalEvaluationsOfMember(id: number): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(this.baseUrl + "api/Evaluation/MemberId/" + id);
  }

  getPhysicalEvaluationsCreatedBy(id : number): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(this.baseUrl + "api/Evaluation/StaffId/" + id);
  }

  getEvaluation(id: number): Observable<Evaluation> {
    return this.http.get<Evaluation>(this.baseUrl + "api/Evaluation/" + id);
  }

  createPhysicalEvaluation(physicalEvaluation: Evaluation): Observable<Evaluation> {
    var dateNow = new Date();
    physicalEvaluation.evaluationDate = dateNow;

    return this.http.post<Evaluation>(this.baseUrl + "api/Evaluation", physicalEvaluation);
  }

}
