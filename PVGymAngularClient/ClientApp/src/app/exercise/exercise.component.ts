import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.css']
})
export class ExerciseComponent {

  @Input('target') target: any;
  @Input('name') name: any;
  @Input('gif') gif: any;
}
