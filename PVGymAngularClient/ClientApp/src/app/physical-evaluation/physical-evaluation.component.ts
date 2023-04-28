/**
 * Author: Bernardo Botelho
 * Description: This component is responsible for displaying the physical evaluations of members or staff, based on the user type.
 * It gets the physical evaluations by calling the PhysicalEvaluationService and gets the user data by calling the UserService.
 * It also gets the member and staff data by calling the MemberService and StaffService.
 * It displays the list of physical evaluations, and allows the user to create, view details, and go back to the list.
 */


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
  public staff: Staff = { id: 0, isAdmin: false, specialization: "", userId: 0 };

  constructor(private service: PhysicalEvaluationService, public userService: UserService, private memberService: MemberService, private staffService: StaffService) { }

  /**
   * Description: This method is called when the component is initialized.
   * It gets the user data and physical evaluations based on whether the user is a member or staff.
   */
  ngOnInit(): void {
    this.userService.getUserDataByEmail()?.subscribe(data => {
      this.user = data;
      this.getPhysicalEvaluations(this.userService.isMember());
    });
  }

  /**
   * Description: This method gets the physical evaluations of a member or staff based on their type.
   * If the user is a member, it gets the physical evaluations of the member using their memberId.
   * If the user is staff, it gets the physical evaluations created by the staff using their id.
   * After getting the physical evaluations, it reverses the order, gets the usernames, and updates the physicalEvaluations array.
   */
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

  /**
   * Description: This method gets the usernames of the members and staff who are associated with the physical evaluations.
   * It loops through each evaluation in the physicalEvaluations array, gets the member and staff data by their ids, and gets the usernames using the getUser method.
   * After getting the usernames, it updates the evaluation object with the memberName and staffName properties.
   */
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

  /*
  * Description: This method is called when the user clicks the Create button.
  * It sets the componentLoad variable to "C" and shows the Back button.
  */
  onCreateClick(): void {
    this.componentLoad = "C";
    this.showBack = true;
  }

  /*
  * Description: This method is called when the user selects a physical evaluation from the list.
  * It sets the evaluationIdDetails variable to the selected evaluation's ID, sets the componentLoad variable to "D", and shows the Back button.
  */
  onSelectPhysicalEvaluation(physicalEvaluation: Evaluation): void {
    this.evaluationIdDetails = physicalEvaluation.id;
    this.componentLoad = "D";
    this.showBack = true;
  }

  /*
  * Description: This method is called when a new physical evaluation is created.
  * It sets the componentLoad variable to "L", hides the Back button, and gets the updated list of physical evaluations.
  */
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
