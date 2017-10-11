import { Component, OnInit } from '@angular/core';
import { Candidate } from '../../models/Candidate';
import { MatDialog, MatDialogRef } from '@angular/material';
import {EmailService} from "../../services/email.service";
import { CandidateService } from '../../services/candidate.service';
import {FlashMessagesService} from "angular2-flash-messages";
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
    public dialogRef: MatDialogRef<EmailManagerComponent>,
    private emailService: EmailService,
    public candidateService: CandidateService,
    public flashMessageService: FlashMessagesService) { }

  ngOnInit() {
    this.githubId = document.getElementById("identifier2").innerHTML.toLowerCase();
    this.url = window.location.origin + '/nfuse';
    this.subscription = this.candidateService.getCandidates().subscribe(candidatesList => {
      for (let candidate of candidatesList) {
        if (candidate.githubID == this.githubId) {
          this.candidate = candidate;
          // NOTE: do not put spaces before or after /n new lines because it distorts text sizes in the email
          this.devEmailContent = 'Dear Development Manager,\n\n' + candidate.name + ' has finished their coding problem. Please forward this email to all potential reviewers ' +
            'who would be interested in reviewing this candidate and providing technical feedback.\nThe reviewers can assign themselves ' +
            'to this candidate using this link:\n' + this.url + '/reviewCandidate/' + candidate.$key + '\n\nAfter the reviewers have finished ' +
            'assessing the candidate\'s solution they can submit their technical comments and feedback using the following link:\n'
            + this.url + '/feedback/' + candidate.$key   + '\n\n' + 'MYOB Recruitment Team';
        }
      }
    })
  }

  /**
   * Send email to development manager
   */
  sentEmail(){
    //Check that a valid email is given
    let errorMessage = this.isUndefinedOrEmpty(this.devEmail) ? "Please enter candidate's email":
                       !this.contains(this.devEmail, ['@','.']) ? "Please enter a correct email address":
                       "noFormErrors";

    if (errorMessage != "noFormErrors"){
      this.flashMessageService.show(errorMessage, {cssClass: 'alert-danger', timeout: 3000});
      return;
    }

    this.candidate.progressStatus = "Being Reviewed";
    this.candidateService.updateCandidate(this.candidate);

    this.emailService.sendDevManagerEmail(this.devEmail, this.devEmailContent);
    this.onCloseCancel();
    window.alert("The email was sent successfully");
  }

  onCloseCancel() {
    this.dialogRef.close('Cancel');
  }

  /**
   * Check if a string is null or underfined or size 0
   * @param {string} stringToCheck
   * @returns {boolean}
   */
  isUndefinedOrEmpty(stringToCheck: string) {
    if (stringToCheck === undefined || stringToCheck === null || stringToCheck.trim().length === 0) {
      return true;
    }
    return false;
  }

  /**
   * Check if a string contains all characters in a given array
   * @param stringToCheck
   * @param array
   * @returns {boolean}
   */
  contains(stringToCheck, array) {
    for (let item of array) {
      if (stringToCheck.indexOf(item) === -1) {
        return false;
      }
    }
    return true;
  }

  /**
   * Destroy firebase subscription
   */
  ngOnDestroy(): void {
    if (this.subscription != undefined) {
      this.subscription.unsubscribe();
    }
  }
}
