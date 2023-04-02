import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PhysicalEvaluationService } from '../services/physical-evaluation.service';
@Component({
  selector: 'app-physical-evaluation-create',
  templateUrl: './physical-evaluation-create.component.html',
  styleUrls: ['./physical-evaluation-create.component.css']
})
export class PhysicalEvaluationCreateComponent implements OnInit {

  constructor(private service: PhysicalEvaluationService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(physicalEvaluationForm: NgForm) {
    this.service.createPhysicalEvaluation(physicalEvaluationForm.value).subscribe(res => {
      physicalEvaluationForm.reset();
      this.router.navigateByUrl("physicalEvaluation");
    });
  }

}
