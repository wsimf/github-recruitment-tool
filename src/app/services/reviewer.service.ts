import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import 'rxjs/add/operator/do';
import {Reviewer} from '../models/Reviewer';

@Injectable()
export class ReviewerService {
  reviewers: FirebaseListObservable<Reviewer[]>;

  constructor(public angularfirebase: AngularFireDatabase) {
    this.reviewers = this.angularfirebase.list('/recruiters') as FirebaseListObservable<Reviewer[]>;
  }

  getReviewers() {
    return this.reviewers;
  }

  persistReviewer(reviewer: Reviewer) {
    console.log("Adding reviewer: " + reviewer.name);
    this.reviewers.push(reviewer);
  }

  findReviewer(githubID: string) {
    this.reviewers.forEach(function(reviewer: Reviewer){
      if (reviewer.githubID === githubID) {
        return reviewer;
      }
    });
    // no candidate found
    return null;
  }
}
