import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-edit-can',
  templateUrl: './edit-can.component.html',
  styleUrls: ['./edit-can.component.css']
})
export class EditCanComponent implements OnInit {
  repoName: string;
  candidateName: string;
  candidateEmail: string;
  codingChallenge: string;
  constructor(
    public dialogRef : MatDialogRef<EditCanComponent>,
  ) { }

  ngOnInit() {
  }

  onCloseCancel(){
    this.dialogRef.close('Cancel');
  }
}
