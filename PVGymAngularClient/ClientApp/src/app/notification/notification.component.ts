import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { UserService } from '../user.service';

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
  private user: any;

  constructor(private service: NotificationService, public userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUserDataByEmail()?.subscribe(data => {
      this.user = data;
      this.getNotifications();
    });
  }

  getNotifications(): void {

    this.service.getNotificationsOfUser(this.user.id)
      .subscribe((notifications: Notification[]) => {
        this.notifications = notifications;
        this.notifications.reverse();
        });
  }

  onSelectNotification(notification: Notification): void {
    this.notificationIdDetails = notification.id || 0;
    this.componentLoad = "D";
    this.showBack = true;
  }

  onClearClick(): void {
    if (this.notifications !== undefined) {
      this.notifications?.forEach((notification, index) => {
        if (notification.id !== undefined && notification.isRead) {
          this.service.deleteNotification(notification.id).subscribe();
          this.notifications?.splice(index, 1);
        }
      });
    }
    
  }

}

export interface Notification {
  id?: number;
  userId: string;
  notificationDate: Date;
  subject: string;
  content: string;
  isRead: boolean;
}
