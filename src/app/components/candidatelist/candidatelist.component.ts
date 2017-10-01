import { Component, OnInit, ElementRef } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { AddReviewersComponent } from '../add-reviewers/add-reviewers.component';
import { EditCanComponent } from '../edit-can/edit-can.component';
import { Candidate } from '../../models/Candidate';
import { Reviewer } from '../../models/Reviewer';

import { CandidateService } from '../../services/candidate.service';
// import {Observable} from "rxjs/Observable";
import {GithubService} from "../../services/github.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from 'rxjs/Rx';

interface Repo {
  name: string;
  url: string;
  full_name: string;
  subscribers_url: string;
}

@Component({
  selector: 'app-candidatelist',
  templateUrl: './candidatelist.component.html',
  styleUrls: ['./candidatelist.component.css']
})
export class CandidatelistComponent implements OnInit {
  dialogRef: MdDialogRef<AddReviewersComponent>;
  dialogRef2: MdDialogRef<EditCanComponent>;
  //repos$: Observable<Repo[]>;
  candidates: any[];

  // Fetch all candidate from the database
  //candidates: Candidate[];

  constructor(
    public dialog: MdDialog,
    public githubService: GithubService,
    public candidateService: CandidateService,
    public route: Router
  ) {
    //this.repos$ = this.githubService.getCandidateList();

  }

  ngOnInit() {
      // this.githubService.getCandidateList().subscribe(candidates => {
      // this.candidates = candidates;
      // });
      this.candidateService.getCandidates().subscribe(candidates => {
        this.candidates = candidates;
      });
    // Check pull request every 2 min
    Observable.interval(5000 * 60).subscribe(x => {
      for (let candidate of this.candidates) {
        if (candidate.reviewers === undefined || candidate.reviewers.split(',').length === 0
          || candidate.reviewers === '' ) {
          candidate.progressStatus = 'Doing';
        } else if (candidate.reviews === undefined || candidate.reviews.split(',').length === 0
          || candidate.reviews === '') {
          candidate.progressStatus = 'Being Reviewed';
        } else if (candidate.reviews.split(',').length === candidate.reviewers.split(',').length) {
          candidate.progressStatus = 'Reviewing Completed';
        } else if (candidate.reviews.split(',').length < candidate.reviewers.split(',').length) {
          candidate.progressStatus = candidate.reviews.split(',').length
            + '/' + candidate.reviewers.split(',').length + ' Reviews Finished';
        }
        this.candidateService.updateCandidateStatus(candidate);
      }
    });
  }

  viewResults(githubId: string) {
      this.route.navigate(['results', githubId]);
  }

  openDialog(id: string) {
    this.dialogRef = this.dialog.open(AddReviewersComponent, {
      width:'1px',height:'1px'});
      var hideShadow = document.getElementsByClassName('mat-dialog-container')[0].setAttribute('style', 'padding:0');
       var indentifierDiv =  document.getElementById("identifier");
      indentifierDiv.innerHTML = id;
    }

  editCan(){
    this.dialogRef2 = this.dialog.open(EditCanComponent,{
      width:'1px',height:'1px'});
      var hideShadow = document.getElementsByClassName('mat-dialog-container')[0].setAttribute('style', 'padding:0');
  }

}
