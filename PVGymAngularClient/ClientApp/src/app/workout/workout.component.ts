import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.css']
})
export class WorkoutComponent {

  @Input('title') title: any;
  @Input('exercises') exercises: any;

}
