import { Component, OnInit, ElementRef } from '@angular/core';
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

  constructor(
    public dialog : MdDialog,
  ) { }

  ngOnInit() {
   
  }

  openDialog(){
    this.dialogRef = this.dialog.open(AddReviewersComponent,{
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
