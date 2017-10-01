import { Component, OnInit } from '@angular/core';
import {Candidate} from '../../models/Candidate';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { CandidateService} from '../../services/candidate.service';
import { GithubService } from "../../services/github.service";
import {EmailService} from "../../services/email.service";
import {Observable} from "rxjs/Observable";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-add-cand',
  templateUrl: './add-cand.component.html',
  styleUrls: ['./add-cand.component.css']
})
export class AddCandComponent implements OnInit {
  name: string;
  email: string;
  githubID: string;
  problem: string;
  // repositoryName: string;
  candidate: Candidate;
  candidates:  Observable<any[]>;
  subscription: any;

  constructor(public flashMessageService: FlashMessagesService,
              public router: Router,
              public githubService: GithubService,
              public candidateService: CandidateService,
              private emailService: EmailService,
              public authService: AuthService) {
    this.problem = 'Origin-Technical-Challenge';
  }

  ngOnInit() {
  }

  onSubmit() {

    // check that all fields are entered
    let errorMessage = this.isUndefinedOrEmpty(this.name) ? "Please enter the name of the Candidate":
                       this.isUndefinedOrEmpty(this.email) ? "Please enter candidate's email":
                       !this.contains(this.email, ['@','.']) ? "Please enter a correct email address":
                       this.isUndefinedOrEmpty(this.githubID) ? "Please enter the candidate's Github ID":
                       this.isUndefinedOrEmpty(this.problem) ? "Please select a code problem for this candidate":
                       "noError";

    // If there is an error in the form, display the error message and stop
    if (errorMessage != "noError"){
      this.flashMessageService.show(errorMessage, {cssClass: 'alert-danger', timeout: 3000});
      return;
    }

    // Adder need a new email
    this.authService.getAuth().subscribe( user => {
      console.log(user);
      this.candidate = {
        name: this.name,
        email: this.email,
        githubID: this.githubID,
        problem: this.problem,
        repositoryName: 'code-challenge-' + this.githubID,
        progressStatus: 'Doing',
        adder: user.email,
        reviews: ''
      };
      // check that all fields are entered
      let errorMessage = this.name == undefined || this.name.trim().length == 0 ? "Please enter the name of the Candidate":
        this.email == undefined || this.email.indexOf('@') == -1 || this.email.indexOf('.') ==-1? "Please enter candidate's email":
          this.githubID == undefined || this.name.trim().length == 0 ? "Please enter the candidate's Github ID":
            this.problem == undefined ? "Please select a code problem for this candidate":
              "noError";
      console.log(errorMessage);
      // If there is an error in the form, display the error message and stop
      if (errorMessage != "noError"){
        this.flashMessageService.show(errorMessage, {cssClass: 'alert-danger', timeout: 3000});
        return;
      }
    })

    this.firstSubscribe = true;
    // Now need to check if the Github Id is already in use in our system
    let candidateGithubExists = false;

    let firstSubscribe = true;
    this.subscription = this.candidateService.getCandidates().subscribe(candidateList => {
      // Only allow first execution of subscribe to work
      if (!firstSubscribe) { return;}
      firstSubscribe = false;

      // Check if this GithubId is being used my another candidate
      for (let ca of candidateList) {
        if (ca.githubID != undefined && ca.githubID == this.githubID) {
          candidateGithubExists = true;
          this.flashMessageService.show('This github ID ' + ca.githubID + ' is already registered to a candidate', {
            cssClass: 'alert-danger',
            timeout: 5000
          });
          break;
        }
      }
        //if github id is not being used by another candidate, successfully add it and make repo
        if (!candidateGithubExists) {
          console.log("Adding candidate now..");
          // Create a repo and add candidate
          this.githubService.addCandidate(this.candidate);

          // Email candidate
          this.emailService.sendCandidateEmail(this.candidate);

          // // Persist the candidate
          this.candidateService.newCandidate(this.candidate);

          // Adding candidate succesful
          this.flashMessageService.show('New candidate added!', {cssClass: 'alert-success', timeout: 2000});
          this.router.navigate(['/']);
        }
    });
  }

  isUndefinedOrEmpty(stringToCheck: string) {
    if (stringToCheck === undefined || stringToCheck === null || stringToCheck.trim().length === 0) {
      return true;
    }
    return false;
  }

  contains(stringToCheck, array) {
    for (let item of array) {
      if (stringToCheck.indexOf(item) === -1) {
        return false;
      }
    }
    return true;
  }

  ngOnDestroy(): void {
    if (this.subscription != undefined) {
      this.subscription.unsubscribe();    //close subscription once component ceases, otherwise subscription persists
    }
  }
}
