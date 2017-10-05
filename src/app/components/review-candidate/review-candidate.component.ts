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
  subscription: any;
  subscription2: any;
  githubId: string;
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
    this.subscription = this.route.params.subscribe(params => {
      this.githubId = params.id;
    });
  }

  ngOnInit() {
  }

  ngOnSubmit() {
    //Get name and Email of the reviewer from github
    this.subscription =this.githubService.getUser(this.reviewerGithubId).subscribe( githubUser => {
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
      let candidateFound=false;
      let errorMessage='noError';
      this.subscription2 = this.candidateService.getCandidates().subscribe(candidateList => {
        if(!firstSubscribe) {return}
        firstSubscribe=false;

        for (let ca of candidateList) {

          // First check if candidate with this githubId exists
          if (ca.githubID != undefined && ca.githubID == this.githubId) {

            // Now check if reviewer limit of 5 has not been reached
            let reviewers = ca.reviewers.split(',');
            console.log(reviewers);
            if (reviewers.length != 5) {
              // Succesfully add the reviewer
              this.candidateService.addReviewertoCandidate(this.githubId, this.reviewer.githubID);
              // this.reviewerList = this.candidateService.getReviewerList(this.githubId);


              // If this is a new reviewer, add their details to the db
              this.r = this.reviewerService.findReviewer(this.reviewerGithubId)
              if (this.r == null) {
                this.reviewerService.persistReviewer(this.reviewer);
              }

              // add the reviewer as a collaborator to the repo
              this.githubService.addCollaborator(ca.repositoryName, this.reviewer.githubID).subscribe(res => {
              });

              this.flashMessageService.show('You have successfully been added as a reviewer. You should now have collaborator access to their repo.', {cssClass: 'alert-success', timeout: 5000});
              this.router.navigate(['/']);
            } else { // There are already 5 reviewers
              errorMessage = 'The limit of 5 reviewers has already been met. Cannot assign more reviewers';
            }
            candidateFound = true;
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
      });
    });
  }

  ngOnDestroy(): void {
    if (this.subscription != undefined) {
      this.subscription.unsubscribe();
    }
    if (this.subscription2 != undefined) {
      this.subscription2.unsubscribe();
    }
  }

}