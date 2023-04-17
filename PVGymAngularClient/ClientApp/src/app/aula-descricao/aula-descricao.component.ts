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

  private aulasService: AulasService;
  private userService: UserService;
  private memberService: MemberService;

  @Input() aula: AulaDisponivel | undefined;
  @Input() aulas: Aula[] = [];
  @Input() isInClass: Map<string, boolean> = new Map<string, boolean>();
  public createComponent: boolean = false;
  public studentsVisible = false;
  public students: Member[] = [];

  constructor(aulasService: AulasService, userService: UserService, memberService: MemberService) {
    this.aulasService = aulasService;
    this.userService = userService;
    this.memberService = memberService;
  }

  ngOnInit(): void {
  }

  onCreateClick(): void {
    this.createComponent = true;
  }

  onSubmit(aulaForm: NgForm, aulaDisponivel: AulaDisponivel | undefined) {
    this.aulasService.createAulaForm(aulaForm.value, aulaDisponivel).subscribe(res => {
      aulaForm.reset();
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

  //isInClasses() {
  //  this.userService.getUserDataByEmail()?.subscribe(user => {
  //    console.log("user logado: " + user.id)
  //    for (var aula of this.aulas) {
  //      for (let i = 0; i < this.aulas.length; i++) {
  //        if (this.aulas[i].id == aula.id) {
  //          for (let j = 0; j < this.aulas[i].members.length; j++) {
  //            console.log("user inscrito: " + this.aulas[i].members[j].userId)
  //            if (this.aulas[i].members[j].userId == user.id) {
  //              aula.isInClass = true;
  //            }
  //          }
  //        }
  //      }
  //      aula.isInClass = false;
  //    }
  //  });
  //}

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
              aula.members.splice(aula.members.indexOf(member));
              break;
            }
          }
        });
      });
    });
  }

}
