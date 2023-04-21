import { Component } from '@angular/core';
import { TreinosService } from '../treinos.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-treinos',
  templateUrl: './treinos.component.html',
  styleUrls: ['./treinos.component.css']
})
export class TreinosComponent {

  public isLoading = true;
  public plan: any;

  constructor(public service: TreinosService, public userService: UserService) {}

  ngOnInit() {
    this.userService.getUserDataByEmail()?.subscribe(user => {
      this.service.getPlan(user.id).subscribe(plan => {
        this.isLoading = false;
        return this.plan = plan;
      })
    })
  }
}
