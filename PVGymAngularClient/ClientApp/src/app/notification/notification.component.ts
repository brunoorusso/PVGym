/*
* Author: Bernardo Botelho
* Description: The NotificationComponent is responsible for displaying notifications to the user.
* The component retrieves the notifications for the current user and displays them in a list.
* The user can select a notification to view its details, or clear all read notifications.
*/

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

  /*
  * Description: This method is called when the component is initialized.
  * It retrieves the current user data by email and then calls the getNotifications() method to retrieve the user's notifications.
  */
  ngOnInit(): void {
    this.userService.getUserDataByEmail()?.subscribe(data => {
      this.user = data;
      this.getNotifications();
    });
  }

  /*
  * Description: This method calls the NotificationService to get the notifications for the current user.
  * It then stores the notifications in the notifications array and reverses the array to display the most recent notifications first.
  */
  getNotifications(): void {

    this.service.getNotificationsOfUser(this.user.id)
      .subscribe((notifications: Notification[]) => {
        this.notifications = notifications;
        this.notifications.reverse();
        });
  }

  /*
  * Description: This method is called when a user selects a notification from the list.
  * It sets the ID of the selected notification for displaying details and sets the component state to display the details view.
  * It also sets the showBack property to true to display the back button.
  */
  onSelectNotification(notification: Notification): void {
    this.notificationIdDetails = notification.id || 0;
    this.componentLoad = "D";
    this.showBack = true;
  }

  /*
  * Description: This method is called when the user clicks the clear button.
  * It loops through all notifications, deletes read notifications using the NotificationService, and removes them from the notifications array.
  */
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
