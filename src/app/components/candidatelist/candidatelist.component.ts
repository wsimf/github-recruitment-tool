import { Component, OnInit, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AddReviewersComponent } from '../add-reviewers/add-reviewers.component';
import { EditCanComponent } from '../edit-can/edit-can.component';
import { EmailManagerComponent } from '../email-manager/email-manager.component';
import { Candidate } from '../../models/Candidate';
import { Reviewer } from '../../models/Reviewer';

import { CandidateService } from '../../services/candidate.service';
import {Observable} from "rxjs/Observable";
import {GithubService} from "../../services/github.service";
import {ActivatedRoute, Router} from "@angular/router";
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
  dialogRef: MatDialogRef<AddReviewersComponent>;
  dialogRef2: MatDialogRef<EditCanComponent>;
  dialogRef3: MatDialogRef<EmailManagerComponent>;
  repos$: Observable<Repo[]>;
  candidates: any[];
  isCandidateDone: boolean;

  // Fetch all candidate from the database
  //candidates: Candidate[];

  constructor(
    public dialog: MatDialog,
    public githubService: GithubService,
    public candidateService: CandidateService,
    public route: Router,
    public flashMessageService:FlashMessagesService,
  ){
    //this.repos$ = this.githubService.getCandidateList();

  }

  ngOnInit() {
      // this.githubService.getCandidateList().subscribe(candidates => {
      // this.candidates = candidates;
      // });

      this.candidateService.getCandidates().subscribe(candidates =>{
        this.candidates = candidates;
      });

  }

  viewResults(githubId: string){
      this.route.navigate(['results', githubId]);
  }

  openDialog(id: string) {
    this.dialogRef = this.dialog.open(AddReviewersComponent, {
      width:'1px',height:'1px'});
      var hideShadow = document.getElementsByClassName('mat-dialog-container')[0].setAttribute('style', 'padding:0');
       var indentifierDiv =  document.getElementById("identifier");
      indentifierDiv.innerHTML = id;
    }
  candDone(id: string){
    if(window.confirm("Please confirm if this candidate has finished their coding problem")){
      for(let i = 0; i < this.candidates.length; i++){
        if(id == this.candidates[i].githubID){
          this.candidates[i].progressStatus = "Done";
          this.candidates[i].timestamp = Date.now();
          this.candidateService.editCandidate(this.candidates[i].$key,this.candidates[i]);
          this.flashMessageService.show(this.candidates[i].name+ ' has been finished their coding problem. You may now email a Dev Manager.', {cssClass:'alert-success', timeout: 5000});
          break;
        }
      }
    }
  }

  checkLastUpdated(timestamp : number){
    if(timestamp === undefined){
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

  openEmailManager(id: string){
    this.dialogRef3 = this.dialog.open(EmailManagerComponent,{width:'1px', height:'1px'});
    var hideShadow = document.getElementsByClassName('mat-dialog-container')[0].setAttribute('style', 'padding:0');
    var indentifierDiv =  document.getElementById("identifier2");
    indentifierDiv.innerHTML = id;
  }

  editCan(){
    this.dialogRef2 = this.dialog.open(EditCanComponent,{
      width:'1px',height:'1px'});
      var hideShadow = document.getElementsByClassName('mat-dialog-container')[0].setAttribute('style', 'padding:0');
      // Delete these three lines, setAttribute() is better than createAttribute()
      // var boxShadow = document.createAttribute("style");
    // boxShadow.value = "padding:0";
    // hideShadow.attributes.setNamedItem(boxShadow);
  }

  deleteCandidate(candidate: Candidate) {
    this.candidateService.deleteCand(candidate);
  }
}
