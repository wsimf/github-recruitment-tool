import { Component, OnInit } from '@angular/core';
import { Candidate } from '../../models/Candidate';
import { MdDialog, MdDialogRef } from '@angular/material';
import {EmailService} from "../../services/email.service";
import { CandidateService } from '../../services/candidate.service';
//import {window} from 'rxjs/operator/window';

@Component({
  selector: 'app-email-manager',
  templateUrl: './email-manager.component.html',
  styleUrls: ['./email-manager.component.css']
})
export class EmailManagerComponent implements OnInit {
  githubId: string;
  candidates: any;
  candidate: Candidate;
  devEmail: string;
  devEmailContent: string;
  subscription: any;
  url: string;

  constructor(
    public dialogRef: MdDialogRef<EmailManagerComponent>,
    private emailService: EmailService,
    public candidateService: CandidateService) { }

  ngOnInit() {
    this.githubId = document.getElementById("identifier2").innerHTML.toLowerCase();
    this.url = 'http://localhost/nfuse';
    this.subscription = this.candidateService.getCandidates().subscribe(candidatesList => {
      for (let ca of candidatesList) {
        if (ca.githubID == this.githubId) {
          this.devEmailContent = ca.name + ' has finished their coding problem. Please forward this email to all potential reviewers ' +
            'who would be interested in reviewing this candidate and providing technical feedback.\nThe reviewers can assign themselves ' +
            'to this candidate using this link: \n' + this.url + '/reviewCandidate/' + ca.$key + '\n ' + 'After the reviewers have finished ' +
            'assessing the candidate\'s solution they can submit their technical comments and feedback using the following link:\n'
            + this.url + '/feedback/' + ca.$key;
        }
      }
    })
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

    this.emailService.sendDevManagerEmail(this.devEmail, this.devEmailContent);
    this.onCloseCancel();
    window.alert("The email was sent successfully");
  }

  onCloseCancel() {
    this.dialogRef.close('Cancel');
  }
}
