import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Plan, TreinosService, Workout } from '../treinos.service';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent {
  @Input('plan') plan!: Plan;

  modalVisible = false;
  toggleState: 'create' | 'search' = 'create';
  workoutForm: FormGroup;
  searchResults: any[] = [];

  constructor(private formBuilder: FormBuilder, private service: TreinosService) {
    this.workoutForm = this.formBuilder.group({
      name: ['', Validators.required],
    });
  }

  modalVisibleChange(visible: boolean) {
    this.modalVisible = visible;
  }

  saveWorkout() {
    if (this.toggleState === 'create' && this.workoutForm.valid) {
      const newWorkout: Partial<Workout> = { name: this.workoutForm.value.name, exercises: [] };
      this.service.addWorkout(newWorkout, this.plan.planId).subscribe(resWorkout => {
        this.plan.workouts.push(resWorkout);
        this.workoutForm.reset();
        this.modalVisible = false;
      });
    }
  }

  searchWorkouts(event: Event) {

    const target = event.target as HTMLInputElement;
    const searchValue = target.value;

    if (this.toggleState === 'search') {
      this.service.searchWorkouts(searchValue).subscribe(results => {
        this.searchResults = results;
      });
    }
  }

  selectWorkout(workout: Workout) {
    this.service.addExistingWorkoutToPlan(workout, this.plan.planId).subscribe(resWorkout => {
      this.plan.workouts.push(resWorkout);
      this.workoutForm.reset();
      this.modalVisible = false;
    });
  }

  eliminateWorkout(workout: Workout) {
    this.service.removeWorkoutFromPlan(workout.workoutId, this.plan.planId).subscribe(() => {
      this.plan.workouts.splice(this.plan.workouts.findIndex((item) => item.workoutId === workout.workoutId), 1);
    });
  }
}
