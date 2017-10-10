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
  subscriptions: any[];
  firebaseKey: string;
  candidateGithubId: string;

  @Input() githubId;
  @Input() reviewerGithub;

  constructor(public reviewerService: ReviewerService,
              public router: Router,
              public route: ActivatedRoute,
              public flashMessageService: FlashMessagesService,
              public candidateService: CandidateService) {

    // Retrieve parameter of database key (if provided) to be used to retrieve candidate's github Id
    this.subscriptions = [];
    this.subscriptions.push( this.route.params.subscribe(params => {
        this.firebaseKey = params.id != undefined ? params.id : "";
      this.subscriptions.push( this.candidateService.getCandidates().subscribe(candidateList => {
        this.githubId = "";
        for (let ca of candidateList) {
          if(ca.$key == this.firebaseKey) {
            this.githubId = ca.githubID;
            this.candidateGithubId = ca.githubID;
            break;
          }
          }
        }));
    }));
  }

  ngOnInit() {}

  onSubmit(f: NgForm) {
    let feedback = new FeedbackForm();

    Object.assign(feedback, f.value);

    feedback = JSON.parse(JSON.stringify(feedback, function (key, value) {
      return (key.endsWith("Score") && value === undefined) ? 3 : (value === undefined) ? '' : value
    }));

    // Make Ids case insensitive
    this.candidateGithubId=this.candidateGithubId.toLowerCase();
    feedback.reviewerGithub=feedback.reviewerGithub.toLowerCase();

    // Generate unique reviewId for each feedbackform submitted
    feedback.reviewId= this.candidateGithubId +"&" + feedback.reviewerGithub;
    feedback.githubId = this.candidateGithubId;

    //check if candidate exists and if reviewer is assigned to him, and if this is the first submission
    let errorMessage =  'noError';
    let firstSubscribe = true;
    //console.log("SETTING FIRSTSUB");
    let candidateFound = false;
    this.subscriptions.push (this.candidateService.getCandidates().subscribe(candidateList => {
      //console.log("First sub is: " + firstSubscribe);
      if(!firstSubscribe) {
        return;
      }
      firstSubscribe = false;

      for (let ca of candidateList) {

        // First check if candidate with this githubId exists
        if (ca.githubID != undefined && ca.githubID == this.candidateGithubId) {

          // Now check if this reviewer githubid has been assigned to this candidate
          let reviewers = ca.reviewers.split(',');
          if (reviewers.indexOf(feedback.reviewerGithub) != -1) {

            //Lastly, check that the reviewer has not already submitted feedback TODO: load previously filled feedbackform at the start
            if (ca.reviews.indexOf(feedback.reviewId) == -1) {
              // feedback submission successful
              this.reviewerService.newFeedback(feedback);
              this.candidateService.addReviewtoCandidate(this.candidateGithubId, feedback.reviewId);
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
        errorMessage = "No candidate found with this Github id " + this.candidateGithubId;
      }

      // Display errorMessage if there is one
      if (errorMessage != "noError") {
        this.flashMessageService.show(errorMessage, {cssClass: 'alert-danger', timeout: 5000});
      }
    }));
  }

  /**
   * Destroy Firebase subscriptions when finished
   */
  ngOnDestroy(): void {
    for (let subscription of this.subscriptions){
      if (subscription !== undefined) {
        subscription.unsubscribe();
      }
    }
  }
}


