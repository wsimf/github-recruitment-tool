import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm, NgControl} from "@angular/forms";
import {FeedbackForm} from "../../models/FeedbackForm";
import {ReviewerService} from "../../services/reviewer.service";
import {FlashMessagesService} from "angular2-flash-messages";
import {ActivatedRoute, Router} from "@angular/router";
import {CandidateService} from "../../services/candidate.service";
import {Candidate} from "../../models/Candidate";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
})

export class FeedbackComponent implements OnInit, OnDestroy {
  candidate: Candidate;
  candidates: Observable<any[]>;
  subscription: any;

  @Input() githubId;
  @Input() reviewerGithub;

  constructor(public reviewerService: ReviewerService,
              public router: Router,
              public route: ActivatedRoute,
              public flashMessageService: FlashMessagesService,
              public candidateService: CandidateService) {

    // Retrieve params (if provided) and set the two github Ids inside the input boxes
    this.subscription = this.route.params.subscribe(params => {
      this.githubId = params.githubId != undefined ? params.githubId : "";
      this.reviewerGithub =params.reviewerGithub != undefined ? params.reviewerGithub : "";
    });
  }

  ngOnInit() {
  }


  onSubmit(f: NgForm) {
    let feedback = new FeedbackForm();

    Object.assign(feedback, f.value);

    feedback = JSON.parse(JSON.stringify(feedback, function (key, value) {
      return (key.endsWith("Score") && value === undefined) ? 3 : (value === undefined) ? '' : value
    }));

    // Make Ids case insensitive
    feedback.githubId=feedback.githubId.toLowerCase();
    feedback.reviewerGithub=feedback.reviewerGithub.toLowerCase();

    // Generate unique reviewId for each feedbackform submitted
    feedback.reviewId= feedback.githubId +"&" + feedback.reviewerGithub;

    //check if candidate exists and if reviewer is assigned to him, and if this is the first submission
    let errorMessage='noError';
    let firstSubscribe = true;
    let candidateFound = false;
    this.subscription = this.candidateService.getCandidates().subscribe(candidateList => {
      if(!firstSubscribe) {return}
      firstSubscribe=false;

      for (let ca of candidateList) {

        // First check if candidate with this githubId exists
        if (ca.githubID != undefined && ca.githubID == feedback.githubId) {

          // Now check if this reviewer githubid has been assigned to this candidate
          let reviewers = ca.reviewers.split(',');
          if (reviewers.indexOf(feedback.reviewerGithub) != -1) {

            //Lastly, check that the reviewer has not already submitted feedback TODO: load previously filled feedbackform at the start
            if (ca.reviews.indexOf(feedback.reviewId) == -1) {
              // feedback submission successful
              this.reviewerService.newFeedback(feedback);
              this.candidateService.addReviewtoCandidate(feedback.githubId, feedback.reviewId);
              this.flashMessageService.show('Feedback submitted!', {cssClass: 'alert-success', timeout: 4000});
              this.router.navigate(['/']);

            } else { // This reviewer has already submitted a feedbackform
              errorMessage = 'A feedback form has already been submitted by this reviewer for this candidate';
            }

          } else { // Else: the reviewer is not in the candidate's reviewer list
            errorMessage = 'Your github ID is not assigned to review this candidate';
          }
          candidateFound = true;
          break;  //candidate githubId already found, break the search
        }
      }

      if (!candidateFound) {
        errorMessage= "No candidate found with this Github id " + feedback.githubId;
      }

      // Display errorMessage if there is one
      if (errorMessage != "noError") {
        this.flashMessageService.show(errorMessage, {cssClass: 'alert-danger', timeout: 5000});
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription != undefined) {
      this.subscription.unsubscribe();
    }
  }
}


