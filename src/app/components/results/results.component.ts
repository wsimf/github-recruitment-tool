import { Component, OnInit } from '@angular/core';
import {ReviewerService} from "../../services/reviewer.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  comments: any[];
  githubId: string;
  constructor(public reviewerService: ReviewerService, public route: ActivatedRoute) {
  }

  ngOnInit() {
    // this.reviewerService.getComments().subscribe(comments =>{
    //   this.comments = comments;
    // });
    this.route.params.subscribe(params => {
      this.githubId = params.id;
      // this.comments = this.reviewerService.findReviews(this.githubId);
    });
  }

}
