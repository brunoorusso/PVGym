import { Component, Input, OnInit } from '@angular/core';
import { Evaluation } from '../physical-evaluation/physical-evaluation.component';
import { Member, MemberService } from '../services/member.service';
import { PhysicalEvaluationService } from '../services/physical-evaluation.service';
import { Staff, StaffService } from '../services/staff.service';
import { ApplicationUserModel, UserService } from '../user.service';

@Component({
  selector: 'app-physical-evaluation-details',
  templateUrl: './physical-evaluation-details.component.html',
  styleUrls: ['./physical-evaluation-details.component.css']
})
export class PhysicalEvaluationDetailsComponent implements OnInit {

  @Input() evaluationId: number | undefined;
  physicalEvaluation: Evaluation = { id: 0, memberId: 0, createdBy: 0, memberName: "", staffName: "", evaluationDate: new Date(), height: 0, weight: 0, bmi: 0, bodyFat: 0 };

  constructor(private service: PhysicalEvaluationService, private memberService: MemberService, private userService: UserService, private staffService: StaffService) { }

  ngOnInit(): void {
    if (this.evaluationId !== undefined) {
      this.service.getEvaluation(this.evaluationId).subscribe((evaluation: Evaluation) => {
        this.physicalEvaluation = evaluation;

        this.memberService.getMember(evaluation.memberId).subscribe((member: Member) => {
          this.userService.getUser(member.userId).subscribe((user: ApplicationUserModel) => {
            this.physicalEvaluation.memberName = user.userName;
          });
        });

        this.staffService.getStaff(evaluation.createdBy).subscribe((staff: Staff) => {
          this.userService.getUser(staff.userId).subscribe((user: ApplicationUserModel) => {
            this.physicalEvaluation.staffName = user.userName;
          });
        });
      });
    }
  }

}
