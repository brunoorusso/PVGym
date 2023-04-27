/**
 * Author: Ismael Lourenço
 * This component represents a list of workout plans in a workout application.
 * It provides functionality for fetching, displaying, and creating workout plans.
 * The component utilizes the TreinosService to interact with the backend, and manages
 * loading state and visibility of the modal for creating new workout plans.
 */
import { Component, OnInit } from '@angular/core';
import { Plan, TreinosService } from '../services/treinos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-planos',
  templateUrl: './planos.component.html',
  styleUrls: ['./planos.component.css']
})
export class PlanosComponent implements OnInit {

  public plans!: Plan[];
  public isLoading = true;
  public modalVisible = false;
  form!: FormGroup;

  constructor(public service: TreinosService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.service.getPlans().subscribe(plans => {
      this.isLoading = false;
      return this.plans = plans;
    })

    this.form = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  /*
  * This method toggles the visibility of the modal for creating new workout plans.
  */
  modalVisibleChange(visible: boolean) {
    this.modalVisible = visible;
  }

  /*
   * This method saves a new workout plan to the backend.
   */
  savePlan() {
    if (this.form?.valid) {
      const newPlan: Partial<Plan> = { name: this.form.value.name, workouts: [] };
      this.service.addPlan(newPlan).subscribe(addedPlan => {
        this.plans.push(addedPlan);
        this.modalVisibleChange(false);
      });
    }
  }


}
