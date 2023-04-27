import { Component, Input, OnInit } from '@angular/core';
import { Notification } from "../notification/notification.component"
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-notification-details',
  templateUrl: './notification-details.component.html',
  styleUrls: ['./notification-details.component.css']
})
export class NotificationDetailsComponent implements OnInit {

  @Input() notificationId: number | undefined;
  notification: Notification = { id: 0, userId: "", notificationDate: new Date(), subject: "", content: "", isRead: false };

  /*
   * Autor: Bernardo Botelho
   */

  constructor(private service: NotificationService) { }

  ngOnInit(): void {
    if (this.notificationId !== undefined) {
      this.service.getNotification(this.notificationId).subscribe((notification: Notification) => {
        this.notification = notification;
        if (this.notification.id !== undefined) {
          this.notification.isRead = true;
          this.service.updateNotification(this.notification.id, this.notification).subscribe();
        }
      });
    }
  }

}
