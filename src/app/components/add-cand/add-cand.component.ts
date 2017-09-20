import { Component, OnInit } from '@angular/core';
import {Candidate} from '../../models/Candidate';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { CandidateService} from '../../services/candidate.service';
import { GithubService } from "../../services/github.service";

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
  candidate: Candidate;
  constructor(
    public flashMessageService: FlashMessagesService,
    public router: Router,
    public githubService: GithubService,
<<<<<<< HEAD
    public candidateService: CandidateService,
=======
    public candidateService: CandidateService
>>>>>>> 07b9676490cab7ec05bd4cf65482831a4c0e84e3
  ) {
    this.problem = 'Origin-Technical-Challenge';
  }

  ngOnInit() {
  }
  onSubmit() {
    // valid: boolean = true;
    // if (!valid) {
    //   // THE INFORMATION PROVIDE IS NOT VALID DO SOMETHING
    //   this.flashMessageService.show('Invalid input!', { cssClass: 'alert-danger', timeout: 4000 });
    //   this.router.navigate(['/add-cand']);
    // } else {

    // Adder need a new email
    this.candidate = {
      name: this.name,
      email: this.email,
      githubID: this.githubID,
      problem: this.problem,
      progressStatus: 'Doing',
      adder: 'Karyn',
    };

    console.log(this.candidate);
    // Create a repo and add candidate
    this.githubService.addCandidate(this.candidate);

    // Persist the candidate
    this.candidateService.newCandidate(this.candidate);

    // Adding candidate succesful
    this.flashMessageService.show('New candidate added!', { cssClass: 'alert-success', timeout: 2000 });
    this.router.navigate(['/']);
    // }
  }
}
