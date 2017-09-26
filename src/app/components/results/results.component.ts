import { Component, OnInit } from '@angular/core';
import {ReviewerService} from "../../services/reviewer.service";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {FeedbackForm} from "../../models/FeedbackForm";

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  reviews: Observable<FeedbackForm[]>;
  githubId: string;
  constructor(public reviewerService: ReviewerService, public route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.githubId = params.id;
      this.reviews = this.reviewerService.findReviews(this.githubId);
    });
  }

  ngOnInit() {
    // this.reviewerService.getComments().subscribe(comments =>{
    //   this.comments = comments;
    // });

  }

}
