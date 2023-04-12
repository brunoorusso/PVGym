import { Component, OnInit } from '@angular/core';
import { Plan, TreinosService } from '../treinos.service';
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

  modalVisibleChange(visible: boolean) {
    this.modalVisible = visible;
  }

  savePlan() {
    if (this.form?.valid) {
      const newPlan: Partial<Plan> = { name: this.form.value.name, workouts: [] };
      this.service.addPlan(newPlan).subscribe(addedPlan => {
        this.plans.push(addedPlan);
      });
    }
  }


}
