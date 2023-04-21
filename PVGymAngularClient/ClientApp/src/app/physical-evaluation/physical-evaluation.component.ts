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
  private user: any;
  private member: Member = { evaluations: [], memberId: 0, plans: [], planType: "", user: { email: "", password: "", userName: "" }, userId: 0, vat: 0};
  public staff: Staff = { id: 0, isAdmin: false, specialization: "", userId: 0};

  constructor(private service: PhysicalEvaluationService, public userService: UserService, private memberService: MemberService, private staffService: StaffService) { }

  ngOnInit(): void {
    this.userService.getUserDataByEmail()?.subscribe(data => {
      this.user = data;
      this.getPhysicalEvaluations(this.userService.isMember());
    });
  }
   
  getPhysicalEvaluations(isMember: boolean): void {

    if (isMember) {
      this.memberService.getMemberByUserId(this.user.id)
        .subscribe((member: Member) => {
          this.member = member;
          this.service.getPhysicalEvaluationsOfMember(this.member.memberId)
            .subscribe((physicalEvaluations: Evaluation[]) => {
              this.physicalEvaluations = physicalEvaluations;
              this.physicalEvaluations.reverse();
              this.getUsernames();
            });
        });

    } else {
      this.staffService.getStaffByUserId(this.user.id)
        .subscribe((staff: Staff) => {
          this.staff = staff;
          this.service.getPhysicalEvaluationsCreatedBy(this.staff.id)
            .subscribe((physicalEvaluations: Evaluation[]) => {
              this.physicalEvaluations = physicalEvaluations;
              this.physicalEvaluations.reverse();
              this.getUsernames();
            });
        });
    }
  }

  getUsernames(): void {
    this.physicalEvaluations.forEach((evaluation) => {
      this.memberService.getMember(evaluation.memberId).subscribe((member: Member) => {
        this.userService.getUser(member.userId).subscribe((user: ApplicationUserModel) => {
          evaluation.memberName = user.userName;
        });
      });

      this.staffService.getStaff(evaluation.createdBy).subscribe((staff: Staff) => {
        this.userService.getUser(staff.userId).subscribe((user: ApplicationUserModel) => {
          evaluation.staffName = user.userName;
        });
      });
    });
  }

  onCreateClick(): void {
    this.componentLoad = "C";
    this.showBack = true;
  }

  onSelectPhysicalEvaluation(physicalEvaluation: Evaluation): void {
    this.evaluationIdDetails = physicalEvaluation.id;
    this.componentLoad = "D";
    this.showBack = true;
  }

  onPhysicalEvaluationCreated() {
    this.componentLoad = "L";
    this.showBack = false;
    this.getPhysicalEvaluations(this.userService.isMember());
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
