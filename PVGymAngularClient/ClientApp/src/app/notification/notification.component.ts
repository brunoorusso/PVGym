import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  public notifications: Notification[] | undefined;
  public selectedNotification: Notification | undefined;
  public componentLoad: string | undefined = "L";
  public notificationIdDetails: number = 0;
  public showBack: boolean = false;

  constructor(private service: NotificationService) { }

  ngOnInit(): void {
    this.getNotifications();
  }

  getNotifications(): void {
    this.service.getNotifications()
      .subscribe((notifications: Notification[]) => this.notifications = notifications);
  }

  onSelectNotification(notification: Notification): void {
    this.notificationIdDetails = notification.id;
    this.componentLoad = "D";
    this.showBack = true;
  }

}

export interface Notification {
  id: number;
  memberId: string;
  notificationDate: Date;
  subject: string;
  content: string;
}
