/**
 * Author: Ismael Lourenço
 * This component represents a workout in a workout application.
 * It displays the workout details and provides functionality for adding, selecting,
 * and removing exercises from the workout. The component allows editing the workout
 * name and manages the visibility of the modal for adding exercises. It uses the
 * TreinosService to interact with the backend for fetching, creating, and updating
 * workouts and exercises.
 */
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Exercise, TreinosService, Workout } from '../services/treinos.service';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.css']
})
export class WorkoutComponent {

  @Input('workout') workout!: Workout;
  @Input('eliminateWorkout') eliminateWorkout!: ((param: any) => void);

  public modalVisible = false;
  public form: FormGroup;
  toggleState: 'create' | 'search' = 'create';
  public searchResults: Exercise[] = [];

  public editingWorkout = false;

  constructor(private formBuilder: FormBuilder, private service: TreinosService) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      target: [''],
      gifUrl: [''],
      bodyPart: [''],
      equipment: ['']
    });
  }

  /*
  * This method is used to toggle the visibility of the modal for adding exercises.
  */
  modalVisibleChange(visible: boolean) {
    this.modalVisible = visible;
  }

  /*
  * Saves a new exercise to the backend.
  */
  saveExercise() {
    if (this.toggleState === 'create' && this.form.valid) {
      const newExercise: Partial<Exercise> = {
        name: this.form.value.name,
        description: this.form.value.description,
        bodyPart: this.form.value.bodyPart,
        equipment: this.form.value.bodyPart,
        gifUrl: this.form.value.gifUrl,
        target: this.form.value.target,
      };
      this.service.addExercise(newExercise, this.workout.workoutId).subscribe(resExercise => {
        console.log(resExercise);
        this.workout.exercises.push(resExercise);
        this.form.reset();
        this.modalVisibleChange(false);
      });
    }
  }

  /*
  * This method is used to search for exercises using the TreinosService.
  */
  searchExercises(event: Event) {
    const target = event.target as HTMLInputElement;
    const searchValue = target.value;
    // Fetch exercises using the TreinosService
    this.service.searchExercises(searchValue).subscribe(results => {
      this.searchResults = results;
    });
  }

/*
* This method is used to select an exercise from the search results and add it to the workout.
*/
  selectExercise(exercise: Exercise) {
    this.service.addExistingExerciseToWorkout(exercise, this.workout.workoutId).subscribe(resWorkout => {
      this.workout.exercises.push(resWorkout);
      this.form.reset();
      this.modalVisibleChange(false);
    });
  }

/*
* This method is used to remove an exercise from the workout.
*/
  eliminateExercise(exercise: Exercise) {
    this.service.removeExerciceFromWorkout(exercise.exerciseId, this.workout.workoutId).subscribe(() => {
      this.workout.exercises.splice(this.workout.exercises.findIndex((item) => item.exerciseId === exercise.exerciseId), 1);
    });
  }

  /*
  * This method is used to remove the workout from the plan.
  * Calls the eliminateWorkout method passed as an input to the component.
  */
  eliminate() {
    this.eliminateWorkout(this.workout);
  }

  /*
  * This method is used to toggle the editing state of the workout name.
  */
  changeWorkoutEdit() {
    this.editingWorkout = true;
  }

  /*
  * This method is used to update the workout name in the backend.
  */
  updateWorkoutName(newName: string): void {
    this.workout.name = newName;
    this.service.updateWorkout(this.workout).subscribe(updatedWorkout => {
      this.workout = updatedWorkout;
    });
  }

}
