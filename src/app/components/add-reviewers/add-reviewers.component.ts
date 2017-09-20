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
  reviewer: Reviewer;
  reviewers: Reviewer;

  constructor( public dialogRef: MdDialogRef<AddReviewersComponent>,
               public reviewerService: ReviewerService,
               public candidateService: CandidateService) {
  }

  ngOnInit() {
  }

  onCloseCancel() {
    this.dialogRef.close('Cancel');
  }

  addReviewer() {
    // CALL gitubAPI service


    // For database
    var identifierDiv = document.getElementsByClassName("identifier")[0];
    var githubID = identifierDiv.attributes.getNamedItem("id");
    console.log(githubID.value);

    this.reviewer = {
      name: '',
      email: '',
      githubID: this.reviewerGithubID,
    };
    this.candidateService.addReviewertoCandidate(githubID.value, this.reviewer);

  }
}
