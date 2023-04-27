/*
 * Autor: Alexandre Oliveira
 * Co-autor: Bernardo Botelho
 */

import { Member } from './services/member.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AulaDisponivel, Aula } from './aulas-disponiveis.service';

@Injectable({
  providedIn: 'root'
})
export class AulasService {

  constructor(private http: HttpClient, @Inject("BASE_URL") private baseUrl: string) { }

  getTomorrowClasses(): Observable<Class[]> {
    return this.http.get<Class[]>(this.baseUrl + "api/Class/Tomorrow")
      .pipe(catchError(this.handleError));
  }

  /*
   * getClasses Method
   * Receives the name of the class type we want to get
   * Return an array with all the classes (interface Aula) of the given class type
   */
  getClasses(name: string): Observable<Aula[]> {
    if (name == null) {
      return this.http.get<Aula[]>('/api/Class')
        .pipe(catchError(this.handleError));
    } else {
      return this.http.get<Aula[]>('/api/Class/ByName/' + name)
        .pipe(catchError(this.handleError));
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  /*
   * createAulaForm Method
   * Receives the class form and information about the given class type (AulaDisponivel) to create a new class
   * Returns the newly created class
   */
  createAulaForm(aula: Aula, aulaDisponivel: AulaDisponivel | undefined): Observable<Aula> {
    if (aulaDisponivel) {
      aula.availableClassId = aulaDisponivel.id;
      aula.name = aulaDisponivel.name;
      aula.description = aulaDisponivel.description;
      aula.duration = aulaDisponivel.duration;
      aula.image = aulaDisponivel.image;
    }
    return this.http.post<Aula>(this.baseUrl + "api/Class", aula);
  }

  /*
   * deleteClass Method
   * Receives the class id which we want to delete
   * Returns the deleted class
   */
  deleteClass(classId: string): Observable<Class> {
    return this.http.delete<Class>('/api/Class/' + classId)
      .pipe(catchError(this.handleError));
  }

  updateClass(id: number, classToUpdate: Class): Observable<Class> {
    return this.http.put<Class>(this.baseUrl + "api/Class/" + id, classToUpdate );
  }

  /*
   * addMemberToClass Method
   * Receives the member which we want to add to the given class id
   * Returns the changed class (Aula)
   */
  addMemberToClass(member: Member, classId: string): Observable<Class> {
    return this.http.post<Class>('/api/ExistingMemberClass', { memberId: member.memberId, classId: classId })
      .pipe(catchError(this.handleError));
  }

  /*
   * removeMemberFromClass Method
   * Receives the member which we want to remove to the given class id
   * Returns the changed class (Aula)
   */
  removeMemberFromClass(member: Member, classId: string): Observable<Class> {
    return this.http.post<Class>('/api/RemoveMemberFromClass', { memberId: member.memberId, classId: classId })
      .pipe(catchError(this.handleError));
  }

  /*
   * getMemberFutureClasses Method
   * Receives the member id which we want to get all future classes
   * Returns an array of all future classes (Aula)
   */
  getMemberFutureClasses(memberId: string): Observable<Aula[]> {
    return this.http.get<Aula[]>('/api/Class/Member/' + memberId)
      .pipe(catchError(this.handleError));
  }

  /*
   * getMemberPastClasses Method
   * Receives the member id which we want to get all past classes
   * Returns an array of all past classes (Aula)
   */
  getMemberPastClasses(memberId: string): Observable<Aula[]> {
    return this.http.get<Aula[]>('/api/Class/Old/Member/' + memberId)
      .pipe(catchError(this.handleError));
  }

  /*
   * getAvailableClassById Method
   * Receives the available class id which we want to get
   * Returns the available class (AulaDisponivel)
   */
  getAvailableClassById(availableClassId: string): Observable<AulaDisponivel> {
    return this.http.get<AulaDisponivel>('/api/AvailableClass/' + availableClassId)
      .pipe(catchError(this.handleError));
  }

}

export interface Class {
  id: number,
  availableClassId: number,
  coach: string,
  startDate: Date,
  members: Member[],
  name: string,
  description: string,
  duration: string,
  image: string,
  notificationSend: boolean,
}
