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

  // Fetch all candidate from the database
  candidates: Candidate[];

  constructor(
    public dialog: MdDialog,
    public githubService: GithubService,
  ){
    this.repos$ = this.githubService.getCandidateList();
    // Hard code the candidate list
    // this.candidates = [
    //   {
    //     name: 'Joe Joe',
    //     email: 'joejoe123@gmail.com',
    //     githubID: 'JohPa8696',
    //     problem: 'problem1',
    //     repository: 'url1',
    //     progressStatus: 'Done',
    //     adder: 'Karyn',
    //     reviewers: [
    //       {
    //         name: 'Mark Hunt',
    //         email: 'MarkTheManager@gmail.com',
    //         githubID: 'MarkTheManager'
    //       }
    //     ]
    //   },
    //   {
    //     name: 'James Murray',
    //     email: 'james134@gmail.com',
    //     githubID: 'jam134',
    //     problem: 'problem1',
    //     repository: 'url1',
    //     progressStatus: 'Being review',
    //     adder: 'Karyn',
    //     reviewers: [
    //       {
    //         name: 'Mark Hunt',
    //         email: 'MarkTheManager@gmail.com',
    //         githubID: 'MarkTheManager'
    //       }
    //     ]
    //   },
    //   {
    //     name: 'Tom Waz',
    //     email: 'TomTom@gmail.com',
    //     githubID: 'Tom123',
    //     problem: 'problem1',
    //     repository: 'url1',
    //     progressStatus: 'Done',
    //     adder: 'Karyn',
    //     reviewers: [
    //       {
    //         name: 'Jake Romano',
    //         email: 'Jakey123@gmail.com',
    //         githubID: 'Jake123'
    //       }
    //     ]
    //   }
    // ];


  }

  ngOnInit() {
      this.githubService.getCandidateList().subscribe(candidates => {
        this.candidates = candidates;
        console.log(this.candidates);
      });
  }

  openDialog(candidate: Candidate) {
    this.dialogRef = this.dialog.open(AddReviewersComponent, {
      width:'1px',height:'1px'});
      var hideShadow = document.getElementsByClassName('mat-dialog-container')[0];
      var boxShadow = document.createAttribute("style");
      boxShadow.value = "box-shadow:none;";
      hideShadow.attributes.setNamedItem(boxShadow);
      var indentifierDiv = document.getElementsByClassName("identifier")[0];
      var candidateKey = document.createAttribute("id");
      candidateKey.value= candidate.$key;
      indentifierDiv.attributes.setNamedItem(candidateKey);
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
