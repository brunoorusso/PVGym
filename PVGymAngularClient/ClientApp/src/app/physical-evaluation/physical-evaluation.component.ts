import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PhysicalEvaluationService } from '../services/physical-evaluation.service';

@Component({
  selector: 'app-physical-evaluation',
  templateUrl: './physical-evaluation.component.html',
  styleUrls: ['./physical-evaluation.component.css']
})
export class PhysicalEvaluationComponent implements OnInit {

  public physicalEvaluations: Evaluation[] = [];
  public selectedPhysicalEvaluation: Evaluation | undefined;

  constructor(private service: PhysicalEvaluationService, private router: Router) { }

  ngOnInit(): void {
    this.getPhysicalEvaluations();
  }

  getPhysicalEvaluations(): void {
    this.service.getPhysicalEvaluations()
      .subscribe((physicalEvaluations: Evaluation[]) => this.physicalEvaluations = physicalEvaluations);
  }

  onSelectPhysicalEvaluation(physicalEvaluation: Evaluation): void {
    this.router.navigate(["/physicalEvaluation/details", physicalEvaluation.id]);
  }

}

export interface Evaluation {
  id: number;
  memberId: string,
  height: number;
  weight: number;
  bmi: number;
  bodyFat: number;
}
