import { Component, OnInit } from '@angular/core';

const plan = {
  name: "Pull Push Legs",
  workouts: [{
    name: "Pull",
    exercises: [{ name: '3/4 sit-up', target: "abs", gif: "http://d205bpvrqc9yn1.cloudfront.net/0001.gif" },
      { name: 'archer pull up', target: "lats", gif: "http://d205bpvrqc9yn1.cloudfront.net/3293.gif" },
      { name: 'alternate lateral pulldown', target: "lats", gif: "http://d205bpvrqc9yn1.cloudfront.net/0007.gif" },
      { name: 'all fours squad stretch', target: "quads", gif: "http://d205bpvrqc9yn1.cloudfront.net/1512.gif" }]
  },
    {
      name: "Push",
      exercises: [{ name: 'dgg', target: "abs", gif: "http://d205bpvrqc9yn1.cloudfront.net/0001.gif" },
      { name: 'archer pull up', target: "lats", gif: "http://d205bpvrqc9yn1.cloudfront.net/3293.gif" },
      { name: 'alternate lateral pulldown', target: "lats", gif: "http://d205bpvrqc9yn1.cloudfront.net/0007.gif" },
      { name: 'all fours squad stretch', target: "quads", gif: "http://d205bpvrqc9yn1.cloudfront.net/1512.gif" }]
    }  ]
 };

@Component({
  selector: 'app-treinos',
  templateUrl: './treinos.component.html',
  styleUrls: ['./treinos.component.css']
})
export class TreinosComponent implements OnInit {

  plan = plan;

  constructor() { }

  ngOnInit(): void {
  }
  
}
