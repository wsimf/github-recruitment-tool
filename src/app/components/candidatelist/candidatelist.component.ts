import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { AddReviewersComponent } from '../add-reviewers/add-reviewers.component';
import { EditCanComponent } from '../edit-can/edit-can.component';

@Component({
  selector: 'app-candidatelist',
  templateUrl: './candidatelist.component.html',
  styleUrls: ['./candidatelist.component.css']
})
export class CandidatelistComponent implements OnInit {

  dialogRef : MdDialogRef<AddReviewersComponent>;
  dialogRef2 : MdDialogRef<EditCanComponent>;
  dialogResult:"";

  constructor(
    public dialog : MdDialog,
  ) { }

  ngOnInit() {
   
  }

  openDialog(){
    this.dialogRef = this.dialog.open(AddReviewersComponent,{
      width:'1px',height:'1px'});
  }

  editCan(){
    this.dialogRef2 = this.dialog.open(EditCanComponent,{
      width:'1px',height:'1px'});
  }
}
