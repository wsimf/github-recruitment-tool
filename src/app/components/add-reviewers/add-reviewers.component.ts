import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';


@Component({
  selector: 'app-add-reviewers',
  templateUrl: './add-reviewers.component.html',
  styleUrls: ['./add-reviewers.component.css']
})
export class AddReviewersComponent implements OnInit {

  constructor(
    public dialogRef : MdDialogRef<AddReviewersComponent>,
  ) { }

  ngOnInit() {
  }

  onCloseCancel(){
    this.dialogRef.close('Cancel');
  }
}
