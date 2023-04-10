import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Member, MemberService } from '../services/member.service';
import { NotificationService } from '../services/notification.service';
import { Notification } from "../notification/notification.component"
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
  searchTerm: string = "";
  memberEvaluated: number = 0;
  suggestions: Member[] = [];
  showSuggestions: boolean = false;
  private notification: Notification = {
    id: 0,
    memberId: 0,
    notificationDate: new Date(),
    subject: "New Physical Evaluation",
    content: "A new physical evaluation was created and you can now see the details in the Physical Evaluations tab."
  };

  constructor(private service: PhysicalEvaluationService, private memberService: MemberService, private userService: UserService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getMembers();
  }

  getMembers(): void {
    this.memberService.getMembers().subscribe((members: Member[]) => {
      this.members = members;

      this.members.forEach((member) => {
        this.userService.getUser(member.userId).subscribe((user: ApplicationUserModel) => { member.user = user; });
      });

      this.suggestions = this.members;
    });
  }

  onSubmit(physicalEvaluationForm: NgForm) {

    physicalEvaluationForm.value.memberId = this.memberEvaluated;
    physicalEvaluationForm.value.createdBy = this.staffId;
    this.notification.memberId = this.memberEvaluated;

      this.service.createPhysicalEvaluation(physicalEvaluationForm.value).subscribe(res => {
        physicalEvaluationForm.reset();
        this.notificationService.createNotification(this.notification).subscribe();
      });
  }

  filterSuggestions() {
    if (this.searchTerm.length > 0) {
      this.suggestions = this.members.filter(member => member.user.userName.toLowerCase().startsWith(this.searchTerm.toLowerCase()));
      this.showSuggestions = (this.suggestions.length > 0) ? true : false;
    } else {
      this.suggestions = this.members;
    }
  }

  selectSuggestion(suggestion: Member) {
    this.searchTerm = suggestion.user.userName;
    this.memberEvaluated = suggestion.memberId;
    this.showSuggestions = false;
  }

}
