import { Component, OnInit, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig} from '@angular/material';
import { EditCanComponent } from '../edit-can/edit-can.component';
import { EmailManagerComponent } from '../email-manager/email-manager.component';
import { Candidate } from '../../models/Candidate';
import { Reviewer } from '../../models/Reviewer';
import {Observable} from 'rxjs/Rx';

import { CandidateService } from '../../services/candidate.service';
import {GithubService} from "../../services/github.service";
import {Router} from "@angular/router";
import { FlashMessagesService } from 'angular2-flash-messages';

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
  dialogRef2: MatDialogRef<EditCanComponent>;
  dialogRef3: MatDialogRef<EmailManagerComponent>;
  repos$: Observable<Repo[]>;
  candidates: any[];
  isCandidateDone: boolean;

  constructor(
    public dialog: MatDialog,
    public githubService: GithubService,
    public candidateService: CandidateService,
    public route: Router,
    public flashMessageService: FlashMessagesService,
  ){}

  ngOnInit() {
      // Fetch all candidate from the database
      this.candidateService.getCandidates().subscribe(candidates =>{
        this.candidates = candidates;
      });
    // Check pull request every 2 min
      Observable.interval(500 * 60).subscribe(x => {
      for (let candidate of this.candidates) {
        if (!(candidate.reviewers === undefined || candidate.reviewers.split(',').length === 0
            || candidate.reviewers === '' )) {
          if (candidate.reviews.split(',').length < candidate.reviewers.split(',').length) {
            candidate.progressStatus = candidate.reviews.split(',').length
              + '/' + candidate.reviewers.split(',').length + ' Reviews Finished';
          }
          this.candidateService.updateCandidate(candidate);
        }
      }
    });
  }

  /***
   * Go to the results page showing feedback submitted for candidate with this Github Id
   *
   * @param {string} githubId
   */
  viewResults(githubId: string){
      this.route.navigate(['results', githubId]);
  }

  /**
   * Mark the candidate status as done
   * Remove the candidate from the repo and update timestamp
   * @param {string} id
   */
  candDone(id: string){
    if( window.confirm("Please confirm if this candidate has finished their coding problem")){
      for(let i = 0; i < this.candidates.length; i++){
        if(id == this.candidates[i].githubID){
          this.candidates[i].progressStatus = "Done";
          this.candidates[i].timestamp = Date.now();
          this.githubService.removeCandidateFromRepo(this.candidates[i]);
          this.candidateService.updateCandidate(this.candidates[i]);
          this.flashMessageService.show(this.candidates[i].name + ' has been finished their coding problem. You may now email a Dev Manager.', {cssClass:'alert-success', timeout: 5000});
          break;
        }
      }
    }
  }

  /**
   * Get the timestamp of the last update
   * @param {number} timestamp
   * @returns {any}
   */
  checkLastUpdated(timestamp: number) {
    if(timestamp === undefined) {
      return 'No Timestamp Saved.';
    }
    var delta = Math.abs(Date.now() - timestamp) / 1000;

    var days = Math.floor(delta / 86400);
    delta -= days * 86400;

    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    var minutes = Math.floor(delta / 60) % 60;
    if(minutes > 30){
      hours ++;
    }
    return days + ' days, ' + hours + ' hours';
  }

  /**
   * Open up email dialog box for sending email to developement manager
   * @param {string} id
   */
  openEmailManager(id: string) {
    this.dialogRef3 = this.dialog.open(EmailManagerComponent,{width:'1px', height:'1px'});
    var hideShadow = document.getElementsByClassName('mat-dialog-container')[0].setAttribute('style', 'padding:0');
    var indentifierDiv =  document.getElementById("identifier2");
    indentifierDiv.innerHTML = id;
  }

  /**
   * Open dialog box with candidate details
   * @param {string} id
   */
  displayCandidateDetails(id: string){
    this.dialogRef2 = this.dialog.open(EditCanComponent);
    this.dialogRef2.componentInstance.id = id;
    var hideShadow = document.getElementsByClassName('mat-dialog-container')[0].setAttribute('style', 'padding:0');
  }

  /**
   * Delete candidate from the system
   * @param {Candidate} candidate
   */
  deleteCandidate(candidate: Candidate) {
    if (window.confirm('Are you sure to delete this candidate?')) {
      this.candidateService.deleteCand(candidate);
    }
  }
}
