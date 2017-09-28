import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgForm, NgControl} from "@angular/forms";
import {FeedbackForm} from "../../models/FeedbackForm";
import {ReviewerService} from "../../services/reviewer.service";
import {FlashMessagesService} from "angular2-flash-messages";
import {Router} from "@angular/router";
import {CandidateService} from "../../services/candidate.service";
import {Candidate} from "../../models/Candidate";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
})
export class FeedbackComponent implements OnInit {
candidate: Candidate;
  // candidateResult: Observable<Candidate[]>;

  constructor(public reviewerService: ReviewerService,
              public router: Router,
              public flashMessageService: FlashMessagesService,
              public candidateService: CandidateService) { }

  ngOnInit() {
  }

  onSubmit(f: NgForm) {
    let feedback = new FeedbackForm();
    Object.assign(feedback, f.value);

    feedback = JSON.parse(JSON.stringify(feedback, function (key, value) {
      return (key.endsWith("Score") && value === undefined) ? 3 : (value === undefined) ? '' : value
    }));
    console.log(feedback);

    //check if candidate exists and if reviewer is assigned to him
    console.log('finding candidate ' + feedback.githubId);

    let candidates = this.candidateService.getCandidates();
    candidates.subscribe(candidateList => {
      var candidateFound = false;
      for (let ca of candidateList) {
        if (ca.githubID != undefined && ca.githubID == feedback.githubId) {
          candidateFound = true;
          let reviewers = ca.reviewers.split(',');
          if (reviewers.indexOf(feedback.reviewerGithub) != -1) {
            // feedback submission succesful
            this.reviewerService.newFeedback(feedback);
            this.flashMessageService.show('Feedback submitted!', {cssClass: 'alert-success', timeout: 2000});
            this.router.navigate(['/']);
          } else {
            // reviewer not in the candidate's reviewer list
            this.flashMessageService.show('Your github ID is not assigned to review candidate ' + ca.githubID, {
              cssClass: 'alert-danger',
              timeout: 5000
            });
          }
          break;
        }
      }
      if (!candidateFound) {
        console.log("No candidate found for id " + feedback.githubId);
        this.flashMessageService.show("No candidate found for id " + feedback.githubId, {
          cssClass: 'alert-danger',
          timeout: 5000
        });
      }
    }).unsubscribe(); // must unsubscribe after being done otherwise method keeps going in other components
  }


}


