import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {Candidate} from '../../models/Candidate';
import {Feedback} from '../../models/Feedback';
import { FlashMessagesService } from 'angular2-flash-messages';
import {ActivatedRoute, Router} from '@angular/router';
import { CandidateService} from '../../services/candidate.service';
import { GithubService } from "../../services/github.service";
import { FeedbackService} from "../../services/feedback.service";
import {NgForm, NgControl} from "@angular/forms";

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  candidateGithub: string; //get this from parameter in the url, actually im not sure if we need this, since we will save the Feedback object to a Candidate, probably keep it just in case
  reviewerGithub: string;  //get this from parameter in the url
  feedbackID: string;
  solution: string;
  solutionslide: number;
  concerns: string;
  concernsslide: number;
  readability: string;
  readabilityslide: number;
  knowledge: string;
  knowledgeslide: number;
  comprehensive: string;
  comprehensiveslide: number;
  quality: string;
  qualityslide: number;
  summary: string;
  recommend: string;
  feedback: Feedback;

  constructor(public flashMessageService: FlashMessagesService,
              public router: Router,
              private route: ActivatedRoute,
              private candidateService: CandidateService,
              private feedbackService: FeedbackService) {
  }

  ngOnInit() {
    // this.route
    //   .queryParams
    //   .subscribe(params => {
    //     this.candidateGithub = params['candidateGithub'];
    //     this.reviewerGithub = params['reviewerGithub'];
    //   });
  }

  onSubmit(/* f: NgForm */) {
     // Create Feedback
    this.feedback = {

      candidateGithub: this.candidateGithub,
    reviewerGithub: this.reviewerGithub,
      feedbackID: this.candidateGithub + "&" + this.reviewerGithub,
      solution: this.solution=== undefined ? '' : this.solution,
    solutionslide: this.solutionslide === undefined ? 3 : this.solutionslide,
    concerns: this.concerns=== undefined ? '' : this.concerns,
    concernsslide: this.concernsslide === undefined ? 3 : this.concernsslide,
    readability: this.readability=== undefined ? '' : this.readability,
    readabilityslide: this.readabilityslide=== undefined ? 3 : this.readabilityslide,
    knowledge: this.knowledge=== undefined ? '' : this.knowledge,
    knowledgeslide: this.knowledgeslide=== undefined ? 3 : this.knowledgeslide,
    comprehensive: this.comprehensive=== undefined ? '' : this.comprehensive,
    comprehensiveslide: this.comprehensiveslide=== undefined ? 3 : this.comprehensiveslide,
    quality: this.quality=== undefined ? '' : this.quality,
    qualityslide: this.qualityslide=== undefined ? 3 : this.qualityslide,
    summary: this.summary=== undefined ? '' : this.summary,
    recommend: this.recommend=== undefined ? '' : this.recommend,
    };

    // let feedback = new Feedback();
    // Object.assign(feedback, f.value);
    //
    // feedback = JSON.parse(JSON.stringify(feedback, function (key, value) {
    //   return (key.endsWith("slide") && value === undefined) ? 3 : (value === undefined) ? '' : value
    // }));

    console.log(this.feedback);
    // Persist the candidate
    this.feedbackService.newFeedback(this.feedback);


    // feedback submission succesful
    this.flashMessageService.show('Feedback submitted!', { cssClass: 'alert-success', timeout: 2000 });
    this.router.navigate(['/']);
    // }

    //testing
    //console.log(this.feedbackService.getCandidateFeedback('jfk123'));

  }
}
