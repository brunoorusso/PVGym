import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Member, MemberService } from '../services/member.service';
import { PhysicalEvaluationService } from '../services/physical-evaluation.service';
import { ApplicationUserModel, UserService } from '../user.service';
@Component({
  selector: 'app-physical-evaluation-create',
  templateUrl: './physical-evaluation-create.component.html',
  styleUrls: ['./physical-evaluation-create.component.css']
})
export class PhysicalEvaluationCreateComponent implements OnInit {

  public members: Member[] = [];

  constructor(private service: PhysicalEvaluationService, private memberService: MemberService, private userService: UserService) { }

  ngOnInit(): void {
    this.getMembers();
  }

  getMembers(): void {
    this.memberService.getMembers().subscribe((members: Member[]) => {
      this.members = members;

      this.members.forEach((member) => {
        this.userService.getUser(member.userId).subscribe((user: ApplicationUserModel) => { member.user = user; });
      });
    });
  }

  onSubmit(physicalEvaluationForm: NgForm) {
      this.service.createPhysicalEvaluation(physicalEvaluationForm.value).subscribe(res => {
        physicalEvaluationForm.reset();
        //this.router.navigateByUrl("physicalEvaluation");
      });
  }

}
