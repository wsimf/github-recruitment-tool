import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-edit-can',
  templateUrl: './edit-can.component.html',
  styleUrls: ['./edit-can.component.css']
})
export class EditCanComponent implements OnInit {

  constructor(
    public dialogRef : MdDialogRef<EditCanComponent>,
  ) { }

  ngOnInit() {
  }

  onCloseCancel(){
    this.dialogRef.close('Cancel');
  }
}
