import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Evaluation } from '../physical-evaluation/physical-evaluation.component';
import { PhysicalEvaluationService } from '../services/physical-evaluation.service';

@Component({
  selector: 'app-physical-evaluation-details',
  templateUrl: './physical-evaluation-details.component.html',
  styleUrls: ['./physical-evaluation-details.component.css']
})
export class PhysicalEvaluationDetailsComponent implements OnInit {

  id: number = 0;
  physicalEvaluation: Evaluation = { id: 0, memberId: "", height: 0, weight: 0, bmi: 0, bodyFat: 0 };

  constructor(private service: PhysicalEvaluationService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params["id"];
    this.service.getEvaluation(this.id).subscribe((evaluation: Evaluation) => {
      this.physicalEvaluation = evaluation;
    });
  }

}
