/*
* Author: Bernardo Botelho
* Description: The PhysicalEvaluationService is responsible for retrieving Evaluation objects from the API.
* The service provides methods for retrieving Evaluations for a specific member or staff member, as well as creating a new Evaluation.
*/

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evaluation } from '../physical-evaluation/physical-evaluation.component';


@Injectable({
  providedIn: 'root'
})
export class PhysicalEvaluationService {

  constructor(private http: HttpClient, @Inject("BASE_URL") private baseUrl: string) { }

  /**
   * Description: Returns an Observable of an array of Evaluation objects from the API
   * Endpoint: GET '/api/Evaluation'
   * Returns: Observable of Evaluation[]
   */
  getPhysicalEvaluations(): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(this.baseUrl + "api/Evaluation");
  }

  /**
   * Description: Returns an Observable of an array of Evaluation objects from the API that belong to a specific member
   * Endpoint: GET '/api/Evaluation/MemberId/:id'
   * Params: id - number representing the ID of the desired Member object
   * Returns: Observable of Evaluation[]
   */
  getPhysicalEvaluationsOfMember(id: number): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(this.baseUrl + "api/Evaluation/MemberId/" + id);
  }

  /**
   * Description: Returns an Observable of an array of Evaluation objects from the API that were created by a specific staff member
   * Endpoint: GET '/api/Evaluation/StaffId/:id'
   * Params: id - number representing the ID of the desired Staff object
   * Returns: Observable of Evaluation[]
   */
  getPhysicalEvaluationsCreatedBy(id : number): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(this.baseUrl + "api/Evaluation/StaffId/" + id);
  }

  /**
   * Description: Returns an Observable of a single Evaluation object from the API
   * Endpoint: GET '/api/Evaluation/:id'
   * Params: id - number representing the ID of the desired Evaluation object
   * Returns: Observable of Evaluation
   */
  getEvaluation(id: number): Observable<Evaluation> {
    return this.http.get<Evaluation>(this.baseUrl + "api/Evaluation/" + id);
  }

  /**
   * Description: Creates a new Evaluation object in the API
   * Endpoint: POST '/api/Evaluation'
   * Params: physicalEvaluation - the Evaluation object to be created
   * Returns: Observable of Evaluation
   */
  createPhysicalEvaluation(physicalEvaluation: Evaluation): Observable<Evaluation> {
    var dateNow = new Date();
    physicalEvaluation.evaluationDate = dateNow;

    return this.http.post<Evaluation>(this.baseUrl + "api/Evaluation", physicalEvaluation);
  }

}
