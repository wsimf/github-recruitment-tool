import { Component, OnInit } from '@angular/core';
import { Candidate } from '../../models/Candidate';
import { MdDialog, MdDialogRef } from '@angular/material';
import { CandidateService } from '../../services/candidate.service';

@Component({
  selector: 'app-email-manager',
  templateUrl: './email-manager.component.html',
  styleUrls: ['./email-manager.component.css']
})
export class EmailManagerComponent implements OnInit {
  githubId: string;
  candidates: any;
  candidate: Candidate;

  constructor(
    public dialogRef: MdDialogRef<EmailManagerComponent>,
    public candidateService: CandidateService) { }

  ngOnInit() {
    this.githubId = document.getElementById("identifier2").innerHTML.toLowerCase();
  }

  sentEmail(){
    this.candidateService.getCandidates().subscribe(candidates =>{ this.candidates = candidates; });
    for(let i = 0; i < this.candidates.length; i++){
      if( this.githubId == this.candidates[i].githubID){
        this.candidates[i].progressStatus = "Being Reviewed";
        this.candidates[i].timestamp = Date.now();
        this.candidateService.editCandidate(this.candidates[i].$key,this.candidates[i]);
        this.candidate = this.candidates[i];
        break;
      }
    }

  }
  onCloseCancel() {
    this.dialogRef.close('Cancel');
  }
}
