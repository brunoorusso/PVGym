// workout.component.ts
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

  public modalVisible = false;
  public form: FormGroup;
  toggleState: 'create' | 'search' = 'create';
  public searchResults: Exercise[] = [];

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

  ngOnInit(): void { }

  modalVisibleChange(visible: boolean) {
    this.modalVisible = visible;
  }

  saveExercise() {
    if (this.toggleState === 'create' && this.form.valid) {
      const newExercise = this.form.value;
      // Save the new exercise and add it to the workout
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

  selectExercise(exercise: any) {
    // Add the selected exercise to the workout
  }

}
