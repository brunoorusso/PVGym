/**
 * Author: Bernardo Botelho
 * Description: This component represents the navigation menu of the application.
 * It is responsible for retrieving and displaying new notifications for the current user, and collapsing/expanding the menu.
 * It subscribes to the router events to update the notifications list after a navigation change.
 * The user data is obtained by calling the UserService.
 * The new notifications are retrieved from the NotificationService based on the user id.
 */

import { Component, OnDestroy } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { UserService } from '../user.service';
import { Notification } from "../notification/notification.component";
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnDestroy {

  public newNotifications: Notification[] | undefined = [];
  private subscription: Subscription = new Subscription;
  private user: any;

  /**
   * Description: Constructs the NavMenuComponent class with the UserService, NotificationService, and Router injected.
   * It retrieves the current user's data from the UserService and subscribes to the observable that is returned.
   * When the user's data is received, it is assigned to the 'user' property and 'getNewNotifications()' is called.
   * It also subscribes to the 'router.events' observable and checks if the event is an instance of NavigationEnd.
   * If it is, it calls 'getNewNotifications()' again to update the notifications list.
   */
  constructor(public service: UserService, public notificationService: NotificationService, private router: Router) {
    this.service.getUserDataByEmail()?.subscribe(data => {
      this.user = data;
      this.getNewNotifications();
      this.subscription = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.getNewNotifications();
        }
      });
    });
  }

  ngOnDestroy() {
    // Unsubscribe from router events to avoid memory leaks
    this.subscription.unsubscribe();
  }

  /**
   * Description: Retrieves the new notifications for the current user from the NotificationService.
   * The notifications list is reversed to show the most recent first.
   */
  getNewNotifications(): void {

    this.notificationService.getNewNotificationsOfUser(this.user.id)
      .subscribe((notifications: Notification[]) => {
        this.newNotifications = notifications;
        this.newNotifications.reverse();
      });
  }

  isExpanded = false;

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
