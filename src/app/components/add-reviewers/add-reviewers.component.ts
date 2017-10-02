import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Reviewer } from '../../models/Reviewer';
import { Router } from '@angular/router';
import { ReviewerService } from '../../services/reviewer.service';
import { CandidateService } from '../../services/candidate.service';
import { Candidate } from '../../models/Candidate';
import { GithubService} from "../../services/github.service";
import {EmailService} from "../../services/email.service";


@Component({
  selector: 'app-add-reviewers',
  templateUrl: './add-reviewers.component.html',
  styleUrls: ['./add-reviewers.component.css']
})
export class AddReviewersComponent implements OnInit {
  reviewerGithubID: string;
  reviewer: Reviewer;
  githubId: string;
  reviewerList: any[];
  candidate: Candidate;
  private githubUser: any;
  private r: Reviewer;
  subscription: any;

  constructor(public dialogRef: MdDialogRef<AddReviewersComponent>,
    public reviewerService: ReviewerService,
    public candidateService: CandidateService,
    public githubService: GithubService, private emailService: EmailService) {
  }

  ngOnInit() {
    this.githubId = document.getElementById("identifier").innerHTML.toLowerCase();
    this.reviewerList = this.candidateService.getReviewerList(this.githubId);
  }

  onCloseCancel() {
    this.dialogRef.close('Cancel');
  }

  addReviewer() {
    //Send Reviewer email
    // For database
    //var identifierDiv = document.getElementById("identifier");
    //var gid = identifierDiv.innerHTML;

    //Get email of the reviewer from github
    this.subscription =this.githubService.getUser(this.reviewerGithubID).subscribe( githubUser => {
      this.githubUser = githubUser;
      console.log('this.githubId is: ' +this.githubId);
      console.log(githubUser);
      this.reviewer = {
        name: this.githubUser.name.toLowerCase(),
        email: this.githubUser.email.toLowerCase(),
        githubID: this.reviewerGithubID.toLowerCase(),
      };
      this.candidate = this.candidateService.addReviewertoCandidate(this.githubId, this.reviewer.githubID);
      this.reviewerList = this.candidateService.getReviewerList(this.githubId);


      // If this is a new reviewer, add their details to the db
      this.r = this.reviewerService.findReviewer(this.reviewerGithubID)
      if (this.r == null) {
        this.reviewerService.persistReviewer(this.reviewer);
      }

      // adding reviewer as collaborator.
      this.githubService.addCollaborator(this.candidate.repositoryName, this.reviewer.githubID).subscribe(res => {
        console.log(res);
      });

      this.emailService.sendReviewerEmail(this.reviewer);
    });

  }


  ngOnDestroy(): void {
    if (this.subscription != undefined) {
      this.subscription.unsubscribe();
    }
  }
}
