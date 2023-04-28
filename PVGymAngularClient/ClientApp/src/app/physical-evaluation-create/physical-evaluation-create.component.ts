/**
 * Author: Bernardo Botelho
 * Description: This component is responsible for creating a physical evaluation for a member.
 * It gets the member data by calling the MemberService and user data by calling the UserService.
 * It also creates a notification for the member by calling the NotificationService.
 * It allows the user to search for a member by their username and select them to create the evaluation for.
 * It also allows the user to filter the list of members by their username.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Member, MemberService } from '../services/member.service';
import { NotificationService } from '../services/notification.service';
import { Notification } from "../notification/notification.component";
import { PhysicalEvaluationService } from '../services/physical-evaluation.service';
import { ApplicationUserModel, UserService } from '../user.service';

@Component({
  selector: 'app-physical-evaluation-create',
  templateUrl: './physical-evaluation-create.component.html',
  styleUrls: ['./physical-evaluation-create.component.css']
})

export class PhysicalEvaluationCreateComponent implements OnInit {

  public members: Member[] = [];
  @Input() staffId: number | undefined;
  @Output() physicalEvaluationCreated = new EventEmitter<any>();
  searchTerm: string = "";
  memberId: number = 0;
  memberUserId: number = 0;
  suggestions: Member[] = [];
  showSuggestions: boolean = false;
  private notification: Notification = {
    userId: "",
    notificationDate: new Date(),
    subject: "New Physical Evaluation",
    content: "A new physical evaluation was created and you can now see the details in the Physical Evaluations tab.",
    isRead: false
  };

  constructor(private service: PhysicalEvaluationService, private memberService: MemberService, private userService: UserService, private notificationService: NotificationService) { }

  /**
   * Description: This method initializes the component by calling the 'getMembers' method.
   */
  ngOnInit(): void {
    this.getMembers();
  }

  /**
   * Description: This method gets a list of all the members and sets it to the 'members' property.
   * It then loops through the 'members' array and gets the user data for each member by calling the 'getUser' method.
   * It sets the user data for each member and sets the 'suggestions' property to the 'members' array.
   */
  getMembers(): void {
    this.memberService.getMembers().subscribe((members: Member[]) => {
      this.members = members;

      this.members.forEach((member) => {
        this.userService.getUser(member.userId).subscribe((user: ApplicationUserModel) => { member.user = user; });
      });

      this.suggestions = this.members;
    });
  }

  /**
   * Description: This method is called when the physical evaluation form is submitted.
   * It sets the member ID and staff ID in the form, creates a notification for the member, and calls the 'createPhysicalEvaluation' method to create the evaluation.
   * It then resets the form, emits the 'physicalEvaluationCreated' event, and calls the 'createNotification' method to create the notification.
   */
  onSubmit(physicalEvaluationForm: NgForm) {

    physicalEvaluationForm.value.memberId = this.memberId;
    physicalEvaluationForm.value.createdBy = this.staffId;
    this.notification.userId = this.memberUserId.toString();

      this.service.createPhysicalEvaluation(physicalEvaluationForm.value).subscribe(res => {
        physicalEvaluationForm.reset();
        this.notification.notificationDate = new Date();
        this.notificationService.createNotification(this.notification).subscribe();
        this.physicalEvaluationCreated.emit();
      });
  }

  /**
   * Description: This method is called when the user enters a search term in the search input field.
   * It filters the 'members' array by the search term and sets the 'suggestions' property to the filtered array.
   * If the 'suggestions' array has more than 0 items, it sets the 'showSuggestions' property to true, otherwise it sets it to false.
   * If the search term is empty, it sets the 'suggestions' property to the 'members' array.
   */
  filterSuggestions() {
    if (this.searchTerm.length > 0) {
      this.suggestions = this.members.filter(member => member.user.userName.toLowerCase().startsWith(this.searchTerm.toLowerCase()));
      this.showSuggestions = (this.suggestions.length > 0) ? true : false;
    } else {
      this.suggestions = this.members;
    }
  }

  /**
   * Description: This method is called when the user selects a suggestion from the search results dropdown.
   * It sets the selected member's username to the search input field, sets the member ID and member user ID properties, and hides the search results dropdown.
   */
  selectSuggestion(suggestion: Member) {
    this.searchTerm = suggestion.user.userName;
    this.memberId = suggestion.memberId;
    this.memberUserId = suggestion.userId;
    this.showSuggestions = false;
  }

}
