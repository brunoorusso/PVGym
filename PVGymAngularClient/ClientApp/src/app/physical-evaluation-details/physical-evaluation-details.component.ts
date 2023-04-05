import { Component, Input, OnInit } from '@angular/core';
import { Evaluation } from '../physical-evaluation/physical-evaluation.component';
import { PhysicalEvaluationService } from '../services/physical-evaluation.service';

@Component({
  selector: 'app-physical-evaluation-details',
  templateUrl: './physical-evaluation-details.component.html',
  styleUrls: ['./physical-evaluation-details.component.css']
})
export class PhysicalEvaluationDetailsComponent implements OnInit {

  @Input() evaluationId: number | undefined;
  physicalEvaluation: Evaluation = { id: 0, memberId: "", evaluationDate: new Date(), height: 0, weight: 0, bmi: 0, bodyFat: 0 };

  constructor(private service: PhysicalEvaluationService) { }

  ngOnInit(): void {
    if (this.evaluationId !== undefined) {
      this.service.getEvaluation(this.evaluationId).subscribe((evaluation: Evaluation) => {
        this.physicalEvaluation = evaluation;
      });
    }
  }

}
