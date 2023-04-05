import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../user.service';


@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.css']
})
export class InfoModalComponent implements OnInit {
  @Input() title: string = 'Informações';
  @Output() closeModal = new EventEmitter<boolean>();

  public isVisible = false;
  userData: any;
  constructor(public service: UserService) { }

  ngOnInit(): void {
    this.service.getUserDataByEmail()?.subscribe(data => {
      console.log(data);
      this.userData = data;
    });
  }

  onClose() {
    this.closeModal.emit(true);
  }

}
