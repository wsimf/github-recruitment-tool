import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig} from '@angular/material';
import { CandidateService } from '../../services/candidate.service';
import { Candidate } from '../../models/Candidate';
import { Router, ActivatedRoute, Params } from '@angular/router';

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

  SaveChange() {
    this.candidate.reviewers = this.reviewerList.toString();
    this.candidateService.editCandidate(this.id, this.candidate);
    window.alert('Change Saved!');
  }

  deleteReviewer(rev : string){
    if(window.confirm("Are you sure to delete the reviewer?")){
      for( let i = 0; i<this.reviewerList.length ; i++){
        // Find and delete the reviewer from the reviewer list
        if( this.reviewerList[i] == rev){
          this.reviewerList.splice(i,1);
          // Update candidate

        }
      }
    }
  }
}
