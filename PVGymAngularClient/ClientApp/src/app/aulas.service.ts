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
    return this.http.get<Class[]>(this.baseUrl + "/api/Class/Tomorrow");
  }

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

  createAulaForm(aula: Aula, aulaDisponivel: AulaDisponivel | undefined): Observable<Aula> {
    if (aulaDisponivel) {
      aula.availableClassId = aulaDisponivel.id;
      aula.coach = "alex";
      /*aula.members = [];*/
      aula.name = aulaDisponivel.name;
      aula.description = aulaDisponivel.description;
      aula.duration = aulaDisponivel.duration;
      aula.image = aulaDisponivel.image;
    }
    return this.http.post<Aula>(this.baseUrl + "api/Class", aula);
  }

  addMemberToClass(member: Member, classId: string): Observable<Class> {
    return this.http.post<Class>('/api/ExistingMemberClass', { memberId: member.memberId, classId: classId })
      .pipe(catchError(this.handleError));
  }

  removeMemberFromClass(member: Member, classId: string): Observable<Class> {
    return this.http.post<Class>('/api/RemoveMemberFromClass', { memberId: member.memberId, classId: classId })
      .pipe(catchError(this.handleError));
  }

  getStudents(classId: string): Observable<Class[]> {
    return this.http.get<Class[]>('/api/Class/' + classId + '/Members')
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
  image: string
}
