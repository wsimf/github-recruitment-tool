import { Component, OnInit, ElementRef } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { AddReviewersComponent } from '../add-reviewers/add-reviewers.component';
import { EditCanComponent } from '../edit-can/edit-can.component';
import { Candidate } from '../../models/Candidate';
import { Reviewer } from '../../models/Reviewer';

import { CandidateService } from '../../services/candidate.service';
import {Observable} from "rxjs/Observable";
import {GithubService} from "../../services/github.service";

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
  repos$: Observable<Repo[]>;
  candidates: any[];

  // Fetch all candidate from the database
  //candidates: Candidate[];

  constructor(
    public dialog: MdDialog,
    public githubService: GithubService,
    public candidateService: CandidateService
  ){
    //this.repos$ = this.githubService.getCandidateList();

  }

  ngOnInit() {
      //this.githubService.getCandidateList().subscribe(candidates => {
      //this.candidates = candidates;
      //});
      this.candidateService.getCandidates().subscribe(candidates =>{
        this.candidates = candidates;
      })
  }

  openDialog(id: string) {
    this.dialogRef = this.dialog.open(AddReviewersComponent, {
      width:'1px',height:'1px'});
      var hideShadow = document.getElementsByClassName('mat-dialog-container')[0];
      var boxShadow = document.createAttribute("style");
      boxShadow.value = "box-shadow:none;";
      hideShadow.attributes.setNamedItem(boxShadow);
      var indentifierDiv =  document.getElementById("identifier");
      //var candidateId = document.createAttribute("id");
      //candidateId.value= id;
      indentifierDiv.innerHTML = id;
      //indentifierDiv.attributes.setNamedItem(candidateId);
    }

  editCan(){
    this.dialogRef2 = this.dialog.open(EditCanComponent,{
      width:'1px',height:'1px'});
      var hideShadow = document.getElementsByClassName('mat-dialog-container')[0];
      var boxShadow = document.createAttribute("style");
      boxShadow.value = "padding:0";
      hideShadow.attributes.setNamedItem(boxShadow);
  }
}
