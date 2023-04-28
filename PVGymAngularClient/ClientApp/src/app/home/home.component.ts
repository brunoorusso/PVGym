/**
 * Description: This component is responsible for checking the current user's tomorrow classes
 * and sending notifications to the user if they have a class scheduled for tomorrow.
 * It gets the user data by calling the UserService, the classes data by calling the AulasService,
 * and the member data by calling the MemberService.
 * It creates a new notification for the user with details about their class and sends it via the
 * NotificationService.
 */

import { Component } from '@angular/core';
import { AulasService, Class } from '../aulas.service';
import { Member, MemberService } from '../services/member.service';
import { NotificationService } from '../services/notification.service';
import { UserService } from '../user.service';
import { Notification } from "../notification/notification.component"

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {

  private user: any;
  private notification: Notification = {
    userId: "",
    notificationDate: new Date(),
    subject: "Class Tomorrow",
    content: "Tomorrow you have a class of ",
    isRead: false
  };

  constructor(private userService: UserService, private service: AulasService, private notificationService: NotificationService, private memberService: MemberService) { }

  /**
   * Description: This method is called when the component is initialized.
   * It retrieves the user data by email and calls the `checkTomorrowClasses` method
   * if the user is a member.
   */
  ngOnInit(): void {
    this.userService.getUserDataByEmail()?.subscribe(data => {
      this.user = data;
      if (this.userService.isMember()) {
        this.memberService.getMemberByUserId(this.user.id)
          .subscribe((member: Member) => {
            this.checkTomorrowClasses(member);
          });
      }

    });
  }

  /**
   * Description: This method checks if the user has any classes tomorrow.
   * If so, it creates a notification and updates the class notificationSend property to true.
   */
  checkTomorrowClasses(currentMember: Member): void {
    this.service.getTomorrowClasses().subscribe((tomorrowClasses: Class[]) => {
      tomorrowClasses.forEach((classElement) => {
        classElement.members.forEach((member) => {
          if (member.memberId == currentMember.memberId) {
            this.notification.userId = currentMember.userId.toString();
            this.notification.notificationDate = new Date();
            this.notification.content += classElement.name + " with the coach " + classElement.coach + ".";
            this.notificationService.createNotification(this.notification).subscribe(() => {
              classElement.notificationSend = true;
              this.service.updateClass(classElement.id, classElement).subscribe();
            });
          }
        })
      })
    });
  }

}
