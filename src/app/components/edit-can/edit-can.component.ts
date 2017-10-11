import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig} from '@angular/material';
import { CandidateService } from '../../services/candidate.service';
import { Candidate } from '../../models/Candidate';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GithubService } from "../../services/github.service";

@Component({
  selector: 'app-edit-can',
  templateUrl: './edit-can.component.html',
  styleUrls: ['./edit-can.component.css']
})
export class EditCanComponent implements OnInit {
  id: string;
  candidate: Candidate;
  reviewerList: any[];

  constructor(
    public dialogRef : MatDialogRef<EditCanComponent>,
    public candidateService: CandidateService,
    public githubService: GithubService,
    public router: Router,
    public route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.candidateService.getCandidate(this.id).subscribe(candidate => this.candidate = candidate);
    this.reviewerList = this.candidateService.getReviewerList(this.candidate.githubID);
  }

  onCloseCancel(){
    this.dialogRef.close('Cancel');
  }

  /**
   * Remove reviewer from candidate
   * @param {string} reviewer
   */
  deleteReviewer(reviewer : string){
    if(window.confirm("This action will remove the reviewer from the candidate's repo. Do you want to continue?")) {
      let reviewers = '';
      for( let i = 0; i < this.reviewerList.length ; i++){
        // Find and delete the reviewer from the reviewer list
        if( this.reviewerList[i] == reviewer){
          // Remove the reviewer from a repo
          this.githubService.removeReviewerFromRepo(this.candidate.repositoryName, this.reviewerList[i]);
          this.reviewerList.splice(i,1);
        }else {
          if (reviewers !== '') {
            reviewers = reviewers + ',';
          }
          reviewers = reviewers + this.reviewerList[i];
        }
      }
      // console.log(reviewers);
      this.candidate.reviewers = reviewers;
      // Update the candidate in Firebase
      this.candidateService.updateCandidate(this.candidate)
    }
  }
}
