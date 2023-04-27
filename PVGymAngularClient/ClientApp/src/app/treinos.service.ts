/**
 * Author: Ismael Lourenço
 */
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TreinosService {

  constructor(private http: HttpClient) { }

  getPlan(userId: string): Observable<Plan> {
    return this.http.get<Plan>('/api/PlanByMemberId/' + userId)
      .pipe(catchError(this.handleError));
  }

  getPlans(): Observable<Plan[]> {
    return this.http.get<Plan[]>('/api/Plan')
      .pipe(catchError(this.handleError));
  }

  addPlan(plan: Partial<Plan>): Observable<Plan> {
    return this.http.post<Plan>('/api/Plan', plan)
      .pipe(catchError(this.handleError));
  }

  updatePlan(plan: Plan): Observable<Plan> {
    return this.http.put<Plan>('/api/Plan/' + plan.planId, plan )
      .pipe(catchError(this.handleError));
  }

  deletePlan(plan: Plan): Observable<Plan> {
    return this.http.delete<Plan>('/api/Plan/' + plan.planId)
      .pipe(catchError(this.handleError));
  }

  addWorkout(workout: Partial<Workout>, id: string): Observable<Workout> {
    return this.http.post<Workout>('/api/WorkoutPlan', { workout, id })
      .pipe(catchError(this.handleError));
  }

  updateWorkout(workout: Workout): Observable<Workout> {
    return this.http.put<Workout>('/api/Workout/' + workout.workoutId, workout)
      .pipe(catchError(this.handleError));
  }

  addExistingWorkoutToPlan(workout: Partial<Workout>, id: string): Observable<Workout> {
    return this.http.post<Workout>('/api/ExistingWorkoutPlan', { workoutId: workout.workoutId, planId: id })
      .pipe(catchError(this.handleError));
  }

  addExercise(exercise: Partial<Exercise>, id: string): Observable<Exercise> {
    return this.http.post<Exercise>('/api/ExerciseWorkout', { exercise, id })
      .pipe(catchError(this.handleError));
  }

  addExistingExerciseToWorkout(exercise: Exercise, id: string): Observable<Exercise> {
    return this.http.post<Exercise>('/api/ExistingExerciseWorkout', { workoutId: id, exerciseId: exercise.exerciseId })
      .pipe(catchError(this.handleError));
  }

  searchExercises(searchTerm: string): Observable<Exercise[]> {
    return this.http.get<Exercise[]>('/api/Exercise/search?searchTerm=' + searchTerm)
      .pipe(catchError(this.handleError));
  }

  searchWorkouts(searchTerm: string): Observable<Workout[]> {
    return this.http.get<Workout[]>('/api/Workouts/search?searchTerm=' + searchTerm)
      .pipe(catchError(this.handleError));
  }

  removeExerciceFromWorkout(exerciseId: string, workoutId: string): Observable<any> {
    return this.http.post('/api/DeleteExerciseFromWorkout', { workoutId, exerciseId })
      .pipe(catchError(this.handleError));
  }

  removeWorkoutFromPlan(planId: string, workoutId: string): Observable<any> {
    return this.http.post('/api/DeleteWorkoutFromPlan', { workoutId, planId })
      .pipe(catchError(this.handleError));
  }

  assignMember(email: string, planId: string): Observable<any> {
    return this.http.post('/api/AssignMemberToPlan', { email, planId })
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

//Treinos interfaces
export interface Plan {
  planId: string;
  name: string;
  workouts: Workout[];
}

export interface Workout {
  workoutId: string;
  name: string;
  exercises: Exercise[];
}

export interface Exercise {
  exerciseId: string;
  name: string;
  description: string;
  target: string;
  gifUrl: string;
  bodyPart: string;
  equipment: string;
}
