/*
 * Autor: Alexandre Oliveira
 * Co-autor: Bernardo Botelho
 */

import { Component, Input, OnInit } from '@angular/core';
import { AulaDisponivel, Aula } from '../aulas-disponiveis.service';
import { Member } from '../services/member.service';
import { AulasService } from '../aulas.service';
import { UserService } from '../user.service';
import { MemberService } from '../services/member.service';
import { NgForm } from '@angular/forms';
import { Notification } from "../notification/notification.component"
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-aula-descricao',
  templateUrl: './aula-descricao.component.html',
  styleUrls: ['./aula-descricao.component.css']
})

export class AulaDescricaoComponent implements OnInit {

  @Input() aula: AulaDisponivel | undefined;
  @Input() aulas: Aula[] = [];
  @Input() isInClass: Map<string, boolean> = new Map<string, boolean>();
  public createComponent: boolean = false;
  public studentsVisible = false;
  public students: Member[] = [];
  public isCoach: boolean = false;
  public today: Date = new Date();
  private notification: Notification = {
    userId: "",
    notificationDate: new Date(),
    subject: "Maximum Capacity",
    content: "Your class of ",
    isRead: false
  };

  constructor(public aulasService: AulasService, public userService: UserService, public memberService: MemberService, private notificationService: NotificationService) {

  }

  ngOnInit(): void {

  }

  /*
   * onCreateClick Method
   * Changes the shown HTML for a Staff (or Admin) to create a new class.
   * Changes the boolean variable "createComponent".
   */
  onCreateClick(): void {
    this.createComponent = true;
  }

  /*
   * onSubmit Method
   * Creates a new class of a given type (AulaDisponivel) on a given date (info on aulaForm)
   * Changes the "aulas" array in case of success (adds the newly created class).
   */
  onSubmit(aulaForm: NgForm, aulaDisponivel: AulaDisponivel | undefined) {
    this.userService.getUserDataByEmail()?.subscribe(user => {
      aulaForm.value.coachId = user.id;
      aulaForm.value.coach = user.userName;
      aulaForm.value.notificationSend = false;
      this.aulasService.createAulaForm(aulaForm.value, aulaDisponivel).subscribe(aula => {
        aulaForm.reset();
        aula.members = [];
        this.aulas.push(aula);
        this.createComponent = false;
      });
    });
  }

  /*
   * joinClass Method
   * Receives the class id in which the user will join
   * Changes the "aula.members" array of that class in case of success (adds the newly added user).
   */
  joinClass(classId: string): void {
    this.userService.getUserDataByEmail()?.subscribe(user => {
      this.memberService.getMemberByUserId(user.id).subscribe(member => {
        this.aulasService.addMemberToClass(member, classId).subscribe(res => {
          this.isInClass.set(classId, true);
          for (var aula of this.aulas) {
            if (aula.id == classId) {
              aula.members.push(member);
              if (this.aula && (this.aula.limit == aula.members.length)) {
                this.notification.userId = aula.coachId;
                this.notification.content += aula.name + " reached the maximum capacity of students.";
                this.notification.notificationDate = new Date();
                this.notificationService.createNotification(this.notification).subscribe();
              }
              break;
            }
          }
        });
      });
    });
  }

  /*
   * leaveClass Method
   * Receives the class id in which the user will leave
   * Changes the "aula.members" array of that class in case of success (removes the logged in user).
   */
  leaveClass(classId: string): void {
    this.userService.getUserDataByEmail()?.subscribe(user => {
      this.memberService.getMemberByUserId(user.id).subscribe(member => {
        this.aulasService.removeMemberFromClass(member, classId).subscribe(res => {
          this.isInClass.set(classId, false);
          for (var aula of this.aulas) {
            if (aula.id == classId) {
              aula.members.splice(aula.members.indexOf(member), 1);
              break;
            }
          }
        });
      });
    });
  }

  /*
   * deleteClass Method
   * Receives the class id which will be deleted
   * Changes the "aulas" array in case of success (removes the deleted class).
   */
  deleteClass(classId: string): void {
    this.aulasService.deleteClass(classId).subscribe(res => {
      for (var aula of this.aulas) {
        if (aula.id == classId) {
          this.aulas.splice(this.aulas.indexOf(aula), 1);
          break;
        }
      }
    });
  }

  /*
   * showCreateButton Method
   * Return a boolean value indicating if the current user has access to the "create class" button
   */
  showCreateButton() {
    return this.userService.isAdmin() || this.userService.isStaff();
  }

  /*
   * showJoinButton Method
   * Return a boolean value indicating if the current user has access to the "join class" button
   */
  showJoinButton(a: Aula) {
    console.log(a.members.length)
    if (this.aula && !this.userService.isAdmin() && !this.userService.isStaff()) {
      return !this.isInClass.get(a.id) && a.members.length < this.aula.limit;
    }
    return false;
  }

  /*
   * showLeaveButton Method
   * Return a boolean value indicating if the current user has access to the "leave class" button
   */
  showLeaveButton(a: Aula) {
    if (!this.userService.isAdmin() && !this.userService.isStaff()) {
      return this.isInClass.get(a.id);
    }
    return false;
  }

  /*
   * showRemoveButton Method
   * Return a boolean value indicating if the current user has access to the "remove class" button
   */
  showRemoveButton() {
    return this.userService.isAdmin() || this.userService.isStaff();
  }

  /*
   * isLoggedIn Method
   * Return a boolean value indicating if the current user is logged in
   */
  isLoggedIn() {
    return this.userService.isLoggedIn();
  }

}
