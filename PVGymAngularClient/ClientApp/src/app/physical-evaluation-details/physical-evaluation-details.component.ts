/**
 * Author: Bernardo Botelho
 * Description: This component is responsible for displaying the details of a physical evaluation for a member.
 * It retrieves the physical evaluation data from the PhysicalEvaluationService using the 'evaluationId' input.
 * It also gets the user name of the member and staff who created the evaluation by calling the UserService.
 * The member and staff data is obtained from the MemberService and StaffService respectively.
 */

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

  /**
   * Description: This method is called when the component is initialized.
   * It retrieves the physical evaluation details from the service if 'evaluationId' is not undefined.
   * It also gets the user name of the member and staff who created the evaluation by calling the user service.
   */
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
