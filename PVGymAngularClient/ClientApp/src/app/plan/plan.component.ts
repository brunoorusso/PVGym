import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent {

  @Input('title') title: any;
  @Input('workouts') workouts: any;

}
