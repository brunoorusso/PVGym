/**
 * Author: Ismael Lourenço
 * Component represents the workout plans for users in a workout application.
 * It retrieves user-specific workout plans using the TreinosService and UserService. The component
 * displays the workout plan data retrieved from the backend, and handles loading state during data fetching.
 */
import { Component } from '@angular/core';
import { TreinosService } from '../services/treinos.service';
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

  /**
   * The component subscribes to the getUserDataByEmail() method
   * from the UserService to get the user data. It then calls the getPlan() method from the TreinosService
   * to fetch the user's workout plan. Once the plan data is received, it sets the isLoading property
   * to false and assigns the plan to the plan property of the component.
   */
  ngOnInit() {
    this.userService.getUserDataByEmail()?.subscribe(user => {
      this.service.getPlan(user.id).subscribe(plan => {
        this.isLoading = false;
        return this.plan = plan;
      })
    })
  }
}
