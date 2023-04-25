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
