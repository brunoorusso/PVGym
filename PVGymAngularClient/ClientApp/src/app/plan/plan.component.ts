/**
 * Author: Ismael Lourenco
 * Co-author: Bernardo Botelho
 * Represents a workout plan in a workout application.
 * It provides functionality for creating, searching, and managing workouts, as well as assigning
 * workout plans to specific users. The component also supports modifying and deleting workout plans.
 * It utilizes the TreinosService, UserService, and NotificationService to interact with the backend.
 */
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Plan, TreinosService, Workout } from '../services/treinos.service';
import { Notification } from "../notification/notification.component";
import { NotificationService } from '../services/notification.service';
import { ApplicationUserModel, UserService } from '../user.service';

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

  editingPlan = false;

  private notification: Notification = {
    userId: "",
    notificationDate: new Date(),
    subject: "New Plan Assigned",
    content: "A new plan was assigned to you and you can now see the details in the Plans tab.",
    isRead: false
  };

  constructor(private formBuilder: FormBuilder, private service: TreinosService, private notificationService: NotificationService, private userService: UserService) {
    this.workoutForm = this.formBuilder.group({
      name: ['', Validators.required],
    });

    this.memberForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], 
    });
  }

  public boundedEliminateWorkout = this.eliminateWorkout.bind(this);

  /*
  * This method is called when the user clicks the "Create Workout" button.
  * It sets the modal state to "create" and opens the modal.
  */
  modalVisibleChange(visible: boolean) {
    this.modalVisible = visible;
  }

  /*
  * Updates the local plan's workouts array with the added workout, resets the form, and hides the modal.
  */
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

  /**
   * Calls the searchWorkouts() method from the service to search for workouts
   * and updates the searchResults array with the results.
   * 
   * @param event - The input event containing the search value.
   */
  searchWorkouts(event: Event) {

    const target = event.target as HTMLInputElement;
    const searchValue = target.value;

    if (this.toggleState === 'search') {
      this.service.searchWorkouts(searchValue).subscribe(results => {
        this.searchResults = results;
      });
    }
  }

  /**
   * Updates the local plan's workouts array with the added workout, resets the form, and hides the modal.
   *
   * @param workout - The workout object to be added to the plan.
   */
  selectWorkout(workout: Workout) {
    this.service.addExistingWorkoutToPlan(workout, this.plan.planId).subscribe(resWorkout => {
      this.plan.workouts.push(resWorkout);
      this.workoutForm.reset();
      this.modalVisible = false;
    });
  }

  /**
   * A method that takes a workout object and
   * calls the removeWorkoutFromPlan() method from the service to remove the
   * workout from the current plan. It then updates the local plan's workouts
   * array by removing the workout.
   *
   * @param workout - The workout object to be removed from the plan.
   */
  public eliminateWorkout(workout: Workout) {
    this.service.removeWorkoutFromPlan(this.plan.planId, workout.workoutId).subscribe(() => {
      this.plan.workouts.splice(this.plan.workouts.findIndex((item) => item.workoutId === workout.workoutId), 1);
    });
  }

  /**
   * Changes the visibility of the modal used to assign a plan to a member.
   *
   * @param visible - The boolean value to set the assignMemberModalVisible property.
   */
  assignMemberModalVisibleChange(visible: boolean) {
    this.assignMemberModalVisible = visible;
  }

  /**
   * Checks if the memberForm is valid, then assigns
   * the current plan to the user with the specified email.
   * After a successful assignment, it resets the form and hides the modal.
   */
  assignMember() {
    if (this.memberForm.valid) {
      const email = this.memberForm.value.email;

      this.userService.getUserDataByEmail(email)?.subscribe(user => {
        this.notification.userId = user.id;
        this.service.assignMember(email, this.plan.planId).subscribe(() => {
          this.memberForm.reset();
          this.notification.notificationDate = new Date();
          this.notificationService.createNotification(this.notification).subscribe();
          this.assignMemberModalVisible = false;
        });
      });
    
      this.service.assignMember(email, this.plan.planId).subscribe(() => {
        this.memberForm.reset();
        this.assignMemberModalVisible = false;
      });
    }
  }

  /**
   * Sets the editingPlan property to true, enabling editing of the plan's name.
   */
  changeWorkoutEdit() {
    this.editingPlan = true;
  }

  /**
   * A method that takes a new name for the plan, updates the plan's name,
   * and calls the updatePlan() method from the service to update the plan on the server side.
   *
   * @param newName - The new name for the plan.
   */
  updatePlanName(newName: string) {
    this.plan.name = newName;
    this.service.updatePlan(this.plan).subscribe(updatedPlan => {
      this.plan = updatedPlan;
    });
  }

  /**
   * Calls the deletePlan() method from the service
   * to delete the current plan. If the plan is deleted successfully, it reloads
   * the page to reflect the changes.
   */
  deletePlan() {
    this.service.deletePlan(this.plan).subscribe(plan => {
      if(plan !== null) {
        window.location.reload();
      }
    });
  }
}
