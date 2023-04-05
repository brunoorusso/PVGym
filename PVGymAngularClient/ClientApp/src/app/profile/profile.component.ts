import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userData: any;
  public modalVisible = false;

  constructor(public service: UserService) { }

  

  ngOnInit(): void {
    this.service.getUserDataByEmail()?.subscribe(data => {
      this.userData = data;
      this.updateFormValues(this.userData);
    });
    
  }

  modalVisibleChange(visible: boolean) {
    this.modalVisible = visible;
  }

  save() {
    this.service.updateUser()?.subscribe();
    this.userData = this.service.formModel.value;
  }

  private updateFormValues(data: any): void {
    this.service.formModel.patchValue({
      userName: data.userName,
      email: data.email
    });
  }

}
