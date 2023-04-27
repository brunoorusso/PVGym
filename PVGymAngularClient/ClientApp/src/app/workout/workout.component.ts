/**
 * Author: Ismael Lourenço
 */
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Exercise, TreinosService, Workout } from '../treinos.service';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.css']
})
export class WorkoutComponent implements OnInit {

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

  ngOnInit(): void {
    console.log(this.eliminateWorkout)
  }

  modalVisibleChange(visible: boolean) {
    this.modalVisible = visible;
  }

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

  searchExercises(event: Event) {
    const target = event.target as HTMLInputElement;
    const searchValue = target.value;
    // Fetch exercises using the exerciseService
    this.service.searchExercises(searchValue).subscribe(results => {
      this.searchResults = results;
    });
  }

  selectExercise(exercise: Exercise) {
    this.service.addExistingExerciseToWorkout(exercise, this.workout.workoutId).subscribe(resWorkout => {
      this.workout.exercises.push(resWorkout);
      this.form.reset();
      this.modalVisibleChange(false);
    });
  }

  eliminateExercise(exercise: Exercise) {
    this.service.removeExerciceFromWorkout(exercise.exerciseId, this.workout.workoutId).subscribe(() => {
      this.workout.exercises.splice(this.workout.exercises.findIndex((item) => item.exerciseId === exercise.exerciseId), 1);
    });
  }

  eliminate() {
    this.eliminateWorkout(this.workout);
  }

  changeWorkoutEdit() {
    this.editingWorkout = true;
  }

  updateWorkoutName(newName: string): void {
    this.workout.name = newName;
    this.service.updateWorkout(this.workout).subscribe(updatedWorkout => {
      this.workout = updatedWorkout;
    });
  }

}
