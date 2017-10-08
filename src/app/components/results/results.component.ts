import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReviewerService} from "../../services/reviewer.service";
import {ActivatedRoute,Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {FeedbackForm} from "../../models/FeedbackForm";
import {Candidate} from "../../models/Candidate";
import { CandidateService } from '../../services/candidate.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit, OnDestroy {


  reviews: Observable<FeedbackForm[]>;
  candidate: Observable<Candidate>;
  githubId: string;
  subscription: any;
  subscription2: any;

  constructor(public reviewerService: ReviewerService, public route: ActivatedRoute,public candidateService: CandidateService, public router: Router) {
    this.subscription = this.route.params.subscribe(params => {
      this.githubId = params.id;
      this.reviews = this.reviewerService.findReviews(this.githubId);
      this.candidate = this.reviewerService.findName(this.githubId);
    });
  }

  ngOnInit() {
    let tempbool = false;
    this.subscription2 = this.candidateService.getCandidates().subscribe(candidatesList => {
      for (let ca of candidatesList) {
        if (ca.githubID == this.githubId) {
          tempbool = true;
          console.log(ca.githubID);
        }
      }
      if (tempbool == false) this.router.navigate(['pagenotfound']);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription != undefined) {
      this.subscription.unsubscribe();
    }
  }

}
