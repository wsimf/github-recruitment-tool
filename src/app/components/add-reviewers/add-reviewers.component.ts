import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Reviewer } from '../../models/Reviewer';
import { Router } from '@angular/router';
import { ReviewerService } from '../../services/reviewer.service';
import { CandidateService } from '../../services/candidate.service';
import { Candidate } from '../../models/Candidate';


@Component({
  selector: 'app-add-reviewers',
  templateUrl: './add-reviewers.component.html',
  styleUrls: ['./add-reviewers.component.css']
})
export class AddReviewersComponent implements OnInit {
  reviewerGithubID: string;
  reviewers: Reviewer;
  githubId : string;
  reviewerList : any[];

  constructor(public dialogRef: MdDialogRef<AddReviewersComponent>,
    public reviewerService: ReviewerService,
    public candidateService: CandidateService) {
  }

  ngOnInit() {
    this.githubId = document.getElementById("identifier").innerHTML;
    this.reviewerList = this.candidateService.getReviewerList(this.githubId);
  }

  onCloseCancel() {
    this.dialogRef.close('Cancel');
  }

  addReviewer() {
    // CALL gitubAPI service


    // For database
    //var identifierDiv = document.getElementById("identifier");
    //var gid = identifierDiv.innerHTML;
    console.log(this.githubId);
    this.reviewers = {
      name: '',
      email: '',
      githubID: this.reviewerGithubID,
    };
    this.candidateService.addReviewertoCandidate(this.githubId, this.reviewers.githubID);
    this.reviewerList = this.candidateService.getReviewerList(this.githubId);
  }
}
