import { Component, Input, OnInit } from '@angular/core';
import { AulaDisponivel, Aula } from '../aulas-disponiveis.service';
import { Member } from '../services/member.service';
import { AulasService } from '../aulas.service';
import { UserService } from '../user.service';
import { MemberService } from '../services/member.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-aula-descricao',
  templateUrl: './aula-descricao.component.html',
  styleUrls: ['./aula-descricao.component.css']
})

export class AulaDescricaoComponent implements OnInit {

  //private aulasService: AulasService;
  //private userService: UserService;
  //private memberService: MemberService;

  @Input() aula: AulaDisponivel | undefined;
  @Input() aulas: Aula[] = [];
  @Input() isInClass: Map<string, boolean> = new Map<string, boolean>();
  public createComponent: boolean = false;
  public studentsVisible = false;
  public students: Member[] = [];
  public isCoach: boolean = false;

  constructor(public aulasService: AulasService, public userService: UserService, public memberService: MemberService) {
    //this.aulasService = aulasService;
    //this.userService = userService;
    //this.memberService = memberService;
  }

  ngOnInit(): void {

  }

  onCreateClick(): void {
    this.createComponent = true;
  }

  onSubmit(aulaForm: NgForm, aulaDisponivel: AulaDisponivel | undefined) {
    this.userService.getUserDataByEmail()?.subscribe(user => {
      aulaForm.value.coach = user.userName;
      this.aulasService.createAulaForm(aulaForm.value, aulaDisponivel).subscribe(aula => {
        aulaForm.reset();
        aula.members = [];
        this.aulas.push(aula);
      });
    });
  }

  onStudentsClick(students: Member[]): void {
    this.studentsVisible = true;
    this.students = students;
    //this.aulasService.getStudents(classId).subscribe(students => {
    //  //this.students = students;
    //  console.log(students)
    //});
  }

  modalVisibleChange(visible: boolean) {
    this.studentsVisible = visible;
  }

  joinClass(classId: string): void {
    this.userService.getUserDataByEmail()?.subscribe(user => {
      this.memberService.getMemberByUserId(user.id).subscribe(member => {
        this.aulasService.addMemberToClass(member, classId).subscribe(res => {
          this.isInClass.set(classId, true);
          for (var aula of this.aulas) {
            if (aula.id == classId) {
              aula.members.push(member);
              break;
            }
          }
        });
      });
    });
  }

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

  showCreateButton() {
    return this.userService.isAdmin() || this.userService.isStaff();
  }

  showJoinButton(a: Aula) {
    if (this.aula && !this.userService.isAdmin() && !this.userService.isStaff()) {
      return !this.isInClass.get(a.id) || this.aula.limit <= a.members.length;
    }
    return false;
  }

  showLeaveButton(a: Aula) {
    if (!this.userService.isAdmin() && !this.userService.isStaff()) {
      return this.isInClass.get(a.id);
    }
    return false;
  }

  showRemoveButton(a: Aula) {
    if (this.userService.isAdmin() || this.userService.isStaff()) {
      return true;
    }
    return false;
  }

}
