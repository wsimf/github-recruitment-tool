import {Component, OnInit, Output} from '@angular/core';
import { Reviewer } from '../../models/Reviewer';
import { ReviewerService } from '../../services/reviewer.service';
import { CandidateService } from '../../services/candidate.service';
import { Candidate } from '../../models/Candidate';
import { GithubService} from "../../services/github.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FlashMessagesService} from "angular2-flash-messages";

@Component({
  selector: 'app-review-candidate',
  templateUrl: './review-candidate.component.html',
  styleUrls: ['./review-candidate.component.css']
})
export class ReviewCandidateComponent implements OnInit {
  subscriptions: any[];
  githubId: string;
  firebaseKey: string;
  reviewerGithubId: string;
  reviewer: Reviewer;
  private r: Reviewer;
  reviewerList: any[];
  candidate: Candidate;
  private githubUser: any;

  constructor(public reviewerService: ReviewerService,
              public candidateService: CandidateService,
              public flashMessageService: FlashMessagesService,
              public githubService: GithubService,
              public route: ActivatedRoute,
              public router: Router) {
    this.subscriptions.push( this.route.params.subscribe(params => {
      this.firebaseKey = params.id;
    }));
  }

  ngOnInit() {
    let temp = location.pathname.toString().split("/");
    let tempbool = false;
    this.subscriptions.push (this.candidateService.getCandidates().subscribe(candidatesList => {
      for (let ca of candidatesList) {
        if (ca.$key.toString() == temp[3]) {
          tempbool = true;
          // console.log(ca.$key);
        }
      }
      if (tempbool == false) this.router.navigate(['pagenotfound']);
    }));
  }

  ngOnSubmit() {
    //Get name and Email of the reviewer from github
    this.subscriptions.push (this.githubService.getUser(this.reviewerGithubId).subscribe( githubUser => {
      this.githubUser = githubUser;

      this.reviewer = {
        name: this.githubUser.name != undefined ? this.githubUser.name.toLowerCase() : "",
        // NOTE: for some users, github API cannot retrieve the email, hence this cannot reliably get the email,
        // currently we do not need reviewer's email, if needed we should ask for it in this form (reviewcandidate page)
        email: this.githubUser.email != undefined ? this.githubUser.email.toLowerCase() : "",
        githubID: this.reviewerGithubId.toLowerCase(),
      };

      // Need to check if this candidate exists first, and if the total number of reviewers is less than the limit of 5
      let firstSubscribe = true;
      let candidateFound = false;
      let errorMessage = 'noError';
      this.subscriptions.push (this.candidateService.getCandidates().subscribe(candidateList => {
        if (!firstSubscribe) {return;}
        firstSubscribe = false;

        for (let ca of candidateList) {
          // First check if candidate with this githubId exists
          if (ca.$key == this.firebaseKey) {
            candidateFound = true;
            this.githubId = ca.githubID;

            // Now check if reviewer limit of 3 has not been reached
            let reviewers = ca.reviewers == undefined? [] : ca.reviewers.split(',');

            // console.log(reviewers);
            if (reviewers.length == 3) {
              errorMessage = 'The limit of 3 reviewers has already been met. Cannot assign more reviewers';
              break;
            }

            if (reviewers.indexOf(this.reviewerGithubId) != -1) {
              errorMessage = 'A reviewer with this github ID (' + this.reviewerGithubId + ') has already been assigned to this candidate';
              break;
            }

              // Succesfully add the reviewer
              this.candidateService.addReviewertoCandidate(this.githubId, this.reviewer.githubID);
              // this.reviewerList = this.candidateService.getReviewerList(this.githubId);

              // If this is a new reviewer, add their details to the db
              this.reviewerService.persistReviewer(this.reviewer);

              // add the reviewer as a collaborator to the repo
              this.githubService.addCollaborator(ca.repositoryName, this.reviewer.githubID).subscribe(res => {
              });

              this.flashMessageService.show('You have successfully been added as a reviewer. You should now have collaborator access to their repo.', {cssClass: 'alert-success', timeout: 10000});
              this.router.navigate(['/']);
              break;  //candidate githubId already found, break the search
          }
        }

        if (!candidateFound) {
          errorMessage= "No candidate found with this Github id " + this.githubId;
        }

        // Display errorMessage if there is one
        if (errorMessage != "noError") {
          this.flashMessageService.show(errorMessage, {cssClass: 'alert-danger', timeout: 5000});
        }
      }));
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
