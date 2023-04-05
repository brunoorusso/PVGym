import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userData: any;
  isModalOpen: boolean = false;

  constructor(public service: UserService) { }

  ngOnInit(): void {
    this.service.getUserDataByEmail()?.subscribe(data => {
      console.log(data);
      this.userData = data;
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  onCloseModal() {
    this.isModalOpen = false;
  }

}
