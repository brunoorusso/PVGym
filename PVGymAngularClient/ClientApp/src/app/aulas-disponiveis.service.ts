import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Member } from './services/member.service';

@Injectable({
  providedIn: 'root'
})
export class AulasDisponiveisService {

  constructor(private http: HttpClient) { }

  getAvailableClasses(): Observable<AulaDisponivel[]> {
    return this.http.get<AulaDisponivel[]>('/api/AvailableClass')
      .pipe(catchError(this.handleError));
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

}

export interface AulaDisponivel {
  id: string;
  name: string;
  description: string;
  limit: number;
  duration: number;
  image: string;
}

export interface Aula {
  id: string;
  availableClassId: string;
  coachId: string;
  coach: string;
  startDate: Date;
  members: Member[];
  name: string;
  description: string;
  duration: number;
  image: string;
  isInClass: boolean;
}
