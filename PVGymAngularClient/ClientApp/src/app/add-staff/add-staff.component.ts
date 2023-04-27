/*
 * Author: Bruno Russo
 * Description: This component is responsible for the add staff page.
 * It uses the user service by injection to register a new staff.
 */
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.css']
})
export class AddStaffComponent implements OnInit {
  
  constructor(public service: UserService) { }

  /*
   * ngOnInit Method
   * When the component is initialized, the associated formModel is reseted.
   */
  ngOnInit(): void {
    this.service.staffFormModel.reset();
  }

  /*
   * onSubmit Method
   * When the form is submitted, the addStaff method of the user service is called. 
   */
  onSubmit() {
    this.service.addStaff().subscribe();
    this.service.staffFormModel.reset();
  }
}

