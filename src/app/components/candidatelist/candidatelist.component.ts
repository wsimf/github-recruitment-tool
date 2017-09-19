import { Component, OnInit, ElementRef } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { AddReviewersComponent } from '../add-reviewers/add-reviewers.component';
import { EditCanComponent } from '../edit-can/edit-can.component';
import { Candidate } from './Candidate';
import { Reviewer } from './Reviewer';
@Component({
  selector: 'app-candidatelist',
  templateUrl: './candidatelist.component.html',
  styleUrls: ['./candidatelist.component.css']
})
export class CandidatelistComponent implements OnInit {

  dialogRef : MdDialogRef<AddReviewersComponent>;
  dialogRef2 : MdDialogRef<EditCanComponent>;
  candidates: Candidate[];

  constructor(
    public dialog : MdDialog,
  ){
    // Hard code the candidate list
    this.candidates = [
      {
        name: 'Joe Joe',
        email: 'joejoe123@gmail.com',
        githubID: 'JohPa8696',
        progressStatus: 'Done',
        adder: 'Karyn',
        reviewers: [
          {
            name: 'Mark Hunt',
            email: 'MarkTheManager@gmail.com',
            githubID: 'MarkTheManager'
          }
        ]
      },
      {
        name: 'James Murray',
        email: 'james134@gmail.com',
        githubID: 'jam134',
        progressStatus: 'Being review',
        adder: 'Karyn',
        reviewers: [
          {
            name: 'Mark Hunt',
            email: 'MarkTheManager@gmail.com',
            githubID: 'MarkTheManager'
          }
        ]
      },
      {
        name: 'Tom Waz',
        email: 'TomTom@gmail.com',
        githubID: 'Tom123',
        progressStatus: 'Done',
        adder: 'Karyn',
        reviewers: [
          {
            name: 'Jake Romano',
            email: 'Jakey123@gmail.com',
            githubID: 'Jake123'
          }
        ]
      }
    ];


  }

  ngOnInit() {
  }

  openDialog() {
    this.dialogRef = this.dialog.open(AddReviewersComponent, {
      width:'1px',height:'1px'});
      var hideShadow = document.getElementsByClassName('mat-dialog-container')[0];
      var boxShadow = document.createAttribute("style");
      boxShadow.value = "box-shadow:none;";
      hideShadow.attributes.setNamedItem(boxShadow);
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
