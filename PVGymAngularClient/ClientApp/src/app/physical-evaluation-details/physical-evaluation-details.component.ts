import { Component, Input, OnInit } from '@angular/core';
import { Evaluation } from '../physical-evaluation/physical-evaluation.component';
import { Member, MemberService } from '../services/member.service';
import { PhysicalEvaluationService } from '../services/physical-evaluation.service';
import { ApplicationUserModel, UserService } from '../user.service';

@Component({
  selector: 'app-physical-evaluation-details',
  templateUrl: './physical-evaluation-details.component.html',
  styleUrls: ['./physical-evaluation-details.component.css']
})
export class PhysicalEvaluationDetailsComponent implements OnInit {

  @Input() evaluationId: number | undefined;
  physicalEvaluation: Evaluation = { id: 0, memberId: 0, memberName: "", evaluationDate: new Date(), height: 0, weight: 0, bmi: 0, bodyFat: 0 };

  constructor(private service: PhysicalEvaluationService, private memberService: MemberService, private userService: UserService) { }

  ngOnInit(): void {
    if (this.evaluationId !== undefined) {
      this.service.getEvaluation(this.evaluationId).subscribe((evaluation: Evaluation) => {
        this.physicalEvaluation = evaluation;

        this.memberService.getMember(evaluation.memberId).subscribe((member: Member) => {
          this.userService.getUser(member.userId).subscribe((user: ApplicationUserModel) => { this.physicalEvaluation.memberName = user.userName; });
        });
      });
    }
  }

}
