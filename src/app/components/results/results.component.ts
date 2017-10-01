import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReviewerService} from "../../services/reviewer.service";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {FeedbackForm} from "../../models/FeedbackForm";
import {Candidate} from "../../models/Candidate";
import {AuthService} from "../../services/auth.service";

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

  constructor(public reviewerService: ReviewerService, public route: ActivatedRoute) {
    this.subscription = this.route.params.subscribe(params => {
      this.githubId = params.id;
      this.reviews = this.reviewerService.findReviews(this.githubId);
      this.candidate = this.reviewerService.findName(this.githubId);
    });
  }

  ngOnInit() {
    // this.reviewerService.getComments().subscribe(comments =>{
    //   this.comments = comments;
    // });
  }

  ngOnDestroy(): void {
    if (this.subscription != undefined) {
      this.subscription.unsubscribe();
    }
  }

}
