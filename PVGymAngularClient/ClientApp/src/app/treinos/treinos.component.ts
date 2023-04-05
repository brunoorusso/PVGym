import { Component } from '@angular/core';
import { TreinosService } from '../treinos.service';

@Component({
  selector: 'app-treinos',
  templateUrl: './treinos.component.html',
  styleUrls: ['./treinos.component.css']
})
export class TreinosComponent {

  public isLoading = true;
  public plan: any;

  constructor(public service: TreinosService) {}

  ngOnInit() {
    this.service.getPlan().subscribe(plan => {
      this.isLoading = false;
      return this.plan = plan[0];
    })
  }
  
}
