import { Component, OnInit } from '@angular/core';
import {Candidate} from '../../models/Candidate';
import {Feedback} from '../../models/Feedback';
import { FlashMessagesService } from 'angular2-flash-messages';
import {ActivatedRoute, Router} from '@angular/router';
import { CandidateService} from '../../services/candidate.service';
import { GithubService } from "../../services/github.service";


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
              private candidateService: CandidateService) {
  }

  ngOnInit() {
    this.route
      .queryParams
      .subscribe(params => {
        this.candidateGithub = params['candidateGithub'];
        this.reviewerGithub = params['reviewerGithub'];
      });
  }

  onSubmit() {
     // Create Feedback
    this.feedback = {

      candidateGithub: this.candidateGithub,
    feedbackID: this.candidateGithub + "&" + this.reviewerGithub,
    reviewerGithub: this.reviewerGithub,
    solution: this.solution,
    solutionslide: this.solutionslide,
    concerns: this.concerns,
    concernsslide: this.concernsslide,
    readability: this.readability,
    readabilityslide: this.readabilityslide,
    knowledge: this.knowledge,
    knowledgeslide: this.knowledgeslide,
    comprehensive: this.comprehensive,
    comprehensiveslide: this.comprehensiveslide,
    quality: this.quality,
    qualityslide: this.qualityslide,
    summary: this.summary,
    recommend: this.recommend,
    };

    //Need to create feedback service linked with firebase to do this line
    //this.feedbacks.push(this.feedback);

    // Persist the candidate
    this.candidateService.addFeedbacktoCandidate(this.candidateGithub, this.feedback);

    // feedback submission succesful
    this.flashMessageService.show('Feedback submitted!', { cssClass: 'alert-success', timeout: 2000 });
    this.router.navigate(['/']);
    // }
  }
}
