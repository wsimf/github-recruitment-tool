import { Component, OnInit } from '@angular/core';
import {ReviewerService} from "../../services/reviewer.service";
import {FeedbackService} from "../../services/feedback.service";
import {CandidateService} from "../../services/candidate.service";

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  candFeedbacks: any[];
  constructor(public feedbackService: FeedbackService, public candidateService: CandidateService) { }

  ngOnInit() {
    this.candFeedbacks = this.feedbackService.getCandidateFeedback('jfk123');
    console.log(this.candFeedbacks);

  }

}
