import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReviewerService} from "../../services/reviewer.service";
import {ActivatedRoute,Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {FeedbackForm} from "../../models/FeedbackForm";
import {Candidate} from "../../models/Candidate";
import { CandidateService } from '../../services/candidate.service';

/**
 * @results.component.ts
 * Provides functionality to retrieve and display all the feedback that is given for a candidate
 */
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

  constructor(public reviewerService: ReviewerService, public route: ActivatedRoute,public candidateService: CandidateService, public router: Router) {
    this.route.params.subscribe(params => {
      this.githubId = params.id;
      this.reviews = this.reviewerService.findReviews(this.githubId);
      this.candidate = this.reviewerService.findCandidate(this.githubId);
    });
  }

  ngOnInit() {
    let tempbool = false;
    this.subscription = this.candidateService.getCandidates().subscribe(candidatesList => {
      for (let ca of candidatesList) {
        //console.log(this.githubId + " matching with this string: " + ca.githubID );
        if (ca.githubID == this.githubId) {
          tempbool = true;
          //console.log(ca.githubID);
          break;
        }
      }
      if (tempbool == false) this.router.navigate(['pagenotfound']);
    });
  }

  /**
   * Destroy firebase subscription when done
   */
  ngOnDestroy(): void {
    if (this.subscription != undefined) {
      this.subscription.unsubscribe();
    }
  }

}
