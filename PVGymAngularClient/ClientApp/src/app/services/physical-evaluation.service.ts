import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evaluation } from '../physical-evaluation/physical-evaluation.component';
import { v4 as uuidv4 } from 'uuid';


@Injectable({
  providedIn: 'root'
})
export class PhysicalEvaluationService {

  constructor(private http: HttpClient, @Inject("BASE_URL") private baseUrl: string) { }

  getPhysicalEvaluations(): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(this.baseUrl + "api/Evaluation");
  }

  getEvaluation(id: number): Observable<Evaluation> {
    return this.http.get<Evaluation>(this.baseUrl + "api/Evaluation/" + id);
  }

  createPhysicalEvaluation(physicalEvaluation: Evaluation): Observable<Evaluation> {
    var myGuid = uuidv4();
    var dateNow = new Date();


    physicalEvaluation.memberId = "31827e43-c6d0-4583-835e-0ed493f58d4e";
    physicalEvaluation.evaluationDate = dateNow;

    return this.http.post<Evaluation>(this.baseUrl + "api/Evaluation", physicalEvaluation);
  }

}
