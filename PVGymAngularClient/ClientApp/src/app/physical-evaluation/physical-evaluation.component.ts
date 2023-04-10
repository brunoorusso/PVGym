import { Component, OnInit } from '@angular/core';
import { Member, MemberService } from '../services/member.service';
import { PhysicalEvaluationService } from '../services/physical-evaluation.service';
import { Staff, StaffService } from '../services/staff.service';
import { ApplicationUserModel, UserService } from '../user.service';

@Component({
  selector: 'app-physical-evaluation',
  templateUrl: './physical-evaluation.component.html',
  styleUrls: ['./physical-evaluation.component.css']
})
export class PhysicalEvaluationComponent implements OnInit {

  public physicalEvaluations: Evaluation[] = [];
  public selectedPhysicalEvaluation: Evaluation | undefined;
  public componentLoad: string | undefined = "L";
  public evaluationIdDetails: number = 0;
  public showBack: boolean = false;
  public user: any;
  private member: Member = { evaluations: [], memberId: 0, plans: [], planType: 0, user: { email: "", password: "", userName: "" }, userId: 0, vat: 0};
  private staff: Staff = { id: 0, isAdmin: false, specialization: "", userId: 0};

  constructor(private service: PhysicalEvaluationService, public userService: UserService, private memberService: MemberService, private staffService: StaffService) { }

  ngOnInit(): void {
    this.userService.getUserDataByEmail()?.subscribe(data => {
      this.user = data;
      (this.userService.isMember()) ? this.getPhysicalEvaluations(true) : this.getPhysicalEvaluations(false);

    });
  }
   
  getPhysicalEvaluations(isMember: boolean): void {

    if (isMember) {
      this.memberService.getMemberByUserId(this.user.id)
        .subscribe((member: Member) => {
          this.member = member;
          this.service.getPhysicalEvaluationsOfMember(this.member.memberId)
            .subscribe((physicalEvaluations: Evaluation[]) => this.physicalEvaluations = physicalEvaluations);
        });

    } else {
      this.staffService.getStaffByUserId(this.user.id)
        .subscribe((staff: Staff) => {
          this.staff = staff;
          this.service.getPhysicalEvaluationsOfMember(this.staff.id)
            .subscribe((physicalEvaluations: Evaluation[]) => this.physicalEvaluations = physicalEvaluations);
        });
    }
  }

  onCreateClick(): void {
    this.componentLoad = "C";
    this.showBack = true;
  }

  onSelectPhysicalEvaluation(physicalEvaluation: Evaluation): void {
    this.evaluationIdDetails = physicalEvaluation.id;
    this.componentLoad = "D";
    this.showBack = true;
    //this.router.navigate(["/physicalEvaluation/details", physicalEvaluation.id]);
  }

}

export interface Evaluation {
  id: number;
  memberId: number;
  createdBy: number;
  memberName: string;
  staffName: string;
  evaluationDate: Date;
  height: number;
  weight: number;
  bmi: number;
  bodyFat: number;
}
