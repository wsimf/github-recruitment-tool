import { Component, OnInit } from '@angular/core';
import {ReviewerService} from "../../services/reviewer.service";

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  comments: any[];
  constructor(public reviewerService: ReviewerService) { }

  ngOnInit() {
    this.reviewerService.getComments().subscribe(comments =>{
      this.comments = comments;
    });
  }

}
