import { Component, OnInit } from '@angular/core';
import { PhysicalEvaluationService } from '../services/physical-evaluation.service';

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

  constructor(private service: PhysicalEvaluationService) { }

  ngOnInit(): void {
    this.getPhysicalEvaluations();
  }

  getPhysicalEvaluations(): void {
    this.service.getPhysicalEvaluations()
      .subscribe((physicalEvaluations: Evaluation[]) => this.physicalEvaluations = physicalEvaluations);
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
  memberId: string;
  evaluationDate: Date;
  height: number;
  weight: number;
  bmi: number;
  bodyFat: number;
}
