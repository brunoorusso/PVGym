import { Component, OnInit } from '@angular/core';
import { TreinosService } from '../treinos.service';

@Component({
  selector: 'app-planos',
  templateUrl: './planos.component.html',
  styleUrls: ['./planos.component.css']
})
export class PlanosComponent implements OnInit {

  public plans: any;
  public isLoading = true;

  constructor(public service: TreinosService) { }

  ngOnInit() {
    this.service.getPlans().subscribe(plans => {
      this.isLoading = false;
      console.log(plans);
      return this.plans = plans;
    })

  }
}
