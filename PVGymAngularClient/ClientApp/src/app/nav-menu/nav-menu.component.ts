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
    this.subscription.unsubscribe();
  }

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
