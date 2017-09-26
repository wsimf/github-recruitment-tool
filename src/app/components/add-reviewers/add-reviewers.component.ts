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

  constructor(public dialogRef: MdDialogRef<AddReviewersComponent>,
    public reviewerService: ReviewerService,
    public candidateService: CandidateService,
    public githubService: GithubService, private emailService: EmailService) {
  }

  ngOnInit() {
    this.githubId = document.getElementById("identifier").innerHTML;
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
    console.log(this.githubId);
    this.reviewer = {
      name: '',
      email: '',
      githubID: this.reviewerGithubID,
    };
    this.candidate = this.candidateService.addReviewertoCandidate(this.githubId, this.reviewer.githubID);
    this.reviewerList = this.candidateService.getReviewerList(this.githubId);

    // adding reviewer as collaborator.
    this.githubService.addCollaborator(this.candidate.repositoryName, this.reviewer.githubID).subscribe(res => {
      console.log(res);
    });

    this.emailService.sendRecruiterEmail();
  }
}
