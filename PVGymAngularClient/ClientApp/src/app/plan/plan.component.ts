/**
 * Author: Ismael Lourenço
 */
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
  assignMemberModalVisible = false;
  memberForm: FormGroup;

  public editingPlan = false;

  constructor(private formBuilder: FormBuilder, private service: TreinosService) {
    this.workoutForm = this.formBuilder.group({
      name: ['', Validators.required],
    });

    this.memberForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], 
    });
  }

  public boundedEliminateWorkout = this.eliminateWorkout.bind(this);

  modalVisibleChange(visible: boolean) {
    this.modalVisible = visible;
  }

  saveTreino() {
    if (this.toggleState === 'create' && this.workoutForm.valid) {
      const newWorkout: Partial<Workout> = { name: this.workoutForm.value.name, exercises: [] };
      this.service.addWorkout(newWorkout, this.plan.planId).subscribe(resWorkout => {
        this.plan.workouts.push(resWorkout);
        this.workoutForm.reset();
        this.modalVisibleChange(false);
      });
    }
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

  public eliminateWorkout(workout: Workout) {
    this.service.removeWorkoutFromPlan(this.plan.planId, workout.workoutId).subscribe(() => {
      this.plan.workouts.splice(this.plan.workouts.findIndex((item) => item.workoutId === workout.workoutId), 1);
    });
  }

  assignMemberModalVisibleChange(visible: boolean) {
    this.assignMemberModalVisible = visible;
  }

  assignMember() {
    if (this.memberForm.valid) {
      const email = this.memberForm.value.email;
      this.service.assignMember(email, this.plan.planId).subscribe(() => {
        this.memberForm.reset();
        this.assignMemberModalVisible = false;
      });
    }
  }

  changeWorkoutEdit() {
    this.editingPlan = true;
  }

  updatePlanName(newName: string) {
    this.plan.name = newName;
    this.service.updatePlan(this.plan).subscribe(updatedPlan => {
      this.plan = updatedPlan;
    });
  }

  deletePlan() {
    this.service.deletePlan(this.plan).subscribe(plan => {
      if(plan !== null) {
        window.location.reload();
      }
    });
  }
}
