/*
   * Author: Bruno Russo
   * Co-author: Alexandre Oliveira
   * Description: This component is responsible for the profile page.
   * Here the user can see his information and update it.
   * He also can see his statistics displayed in charts.
   */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { UserService } from '../user.service';
import { PhysicalEvaluationService } from '../services/physical-evaluation.service';
import { Member, MemberService } from '../services/member.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userData: any;
  staffData: any;
  public modalVisible = false;
  public physicalEvaluations: Evaluation[] = [];
  public memberInfo: any = null;
  chartOptionsBMI: any = {
    toolTip: {
      fontColor: "black"
    },
    backgroundColor: "transparent",
    title: {
      text: "BMI",
      fontColor: "white"
    },
    animationEnabled: true,
    axisX: {
      labelFontColor: "white"
    },
    axisY: {
      labelFontColor: "white",
      includeZero: true
    },
    data: []
  }
  chartOptionsFat: any = {
    toolTip: {
      fontColor: "black"
    },
    backgroundColor: "transparent",
    title: {
      text: "Body Fat %",
      fontColor: "white"
    },
    animationEnabled: true,
    axisX: {
      labelFontColor: "white"
    },
    axisY: {
      labelFontColor: "white",
      includeZero: true
    },
    data: []
  }
  public chartInstanceBMI: any;
  public chartInstanceFat: any;

  constructor(public service: UserService, public evaluationService: PhysicalEvaluationService, public memberService: MemberService) { }

  
  /*
   * On Init Method
   * When the component is initialized, the user data is retrieved from the database.
   * This method also verify if a user is a staff or a member and retrieve the respective data.
   */ 
  ngOnInit(): void {
    this.service.getUserDataByEmail()?.subscribe(data => {
      this.userData = data;
      this.updateFormValues(this.userData);

      if (this.service.isStaff()) {
        this.service.getStaffById(this.userData.id)?.subscribe(data => {
          this.staffData = data;
        });
      }
      
      if (this.service.isMember()) {
        this.memberService.getMemberByUserId(data.id).subscribe((member: Member) => {
          console.log(member)
          this.getMemberEvaluations(member.memberId);
        });
      }

    });
  }

  /*
   * Modal Visible Change Method
   * This method change the modal visibility.
   */ 
  modalVisibleChange(visible: boolean) {
    this.modalVisible = visible;
  }

  /*
   * Save Method
   * This method is called when the user clicks on the save button and update the user data.
   */ 
  save() {
    this.service.updateUser()?.subscribe();
    this.userData = this.service.formModel.value;
    this.modalVisibleChange(false);
  }

  /*
   * Update Form Values Method
   * This method update the modal form values with the user data.
   */ 
  private updateFormValues(data: any): void {
    this.service.formModel.patchValue({
      userName: data.userName,
      email: data.email
    });
  }

  /*
   * Get Member Evaluations Method
   * This method populates the chart objects (dataBMI & dataFat) with the physical evaluations info
   */ 
  getMemberEvaluations(memberId: number) {
    let dataBMI: Data = {
      type: "line", //change type to bar, line, area, pie, etc
      color: "white",
      indexLabel: "{y}", //Shows y value on all Data Points
      indexLabelFontColor: "white",
      dataPoints: []
    }
    let dataFat: Data = {
      type: "line", //change type to bar, line, area, pie, etc
      color: "white",
      indexLabel: "{y}", //Shows y value on all Data Points
      indexLabelFontColor: "white",
      dataPoints: []
    }

    this.evaluationService.getPhysicalEvaluationsOfMember(memberId).subscribe((physicalEvaluations: Evaluation[]) => {
      this.physicalEvaluations = physicalEvaluations;
      if (this.physicalEvaluations) {
        this.memberInfo = {
          height: this.physicalEvaluations[this.physicalEvaluations.length - 1].height,
          weight: this.physicalEvaluations[this.physicalEvaluations.length - 1].weight
        }
      }
      for (var evaluation of physicalEvaluations) {
        let dataPointBMI = {
          label: this.formatDate(evaluation.evaluationDate),
          y: evaluation.bmi,
          color: "White"
        }
        let dataPointFat = {
          label: this.formatDate(evaluation.evaluationDate),
          y: evaluation.bodyFat,
          color: "White"
        }
        dataBMI.dataPoints.push(dataPointBMI);
        dataFat.dataPoints.push(dataPointFat);
      }
      this.chartOptionsBMI.data.push(dataBMI);
      this.chartOptionsFat.data.push(dataFat);
      this.chartInstanceBMI.render();
      this.chartInstanceFat.render();
    });
  }

  /*
   * Get Chart Instance BMI Method
   * This method update the chartInstanceBMI object when the BMI chart is updated
   */ 
  getChartInstanceBMI(event: any) {
    this.chartInstanceBMI = event;
  }

  /*
   * Get Chart Instance Fat Method
   * This method update the chartInstanceFat object when the fat chart is updated
   */ 
  getChartInstanceFat(event: any) {
    this.chartInstanceFat = event;
  }

  /*
   * Format Date Method
   * This method formats a given Date object to a string of type "dd/MM/yyyy"
   */ 
  formatDate(date: Date) {
    let evaluationDate = new Date(date);
    return evaluationDate.getDate() + "/" + (evaluationDate.getMonth() + 1).toString().padStart(2, "0") + "/" + evaluationDate.getFullYear();
  }

}

export interface DataPoint {
  label: string;
  y: number;
  color: string;
}

export interface Data {
  type: string;
  color: string;
  indexLabel: string;
  indexLabelFontColor: string;
  dataPoints: DataPoint[];
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
