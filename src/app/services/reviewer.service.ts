import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import 'rxjs/add/operator/do';
import {FeedbackForm} from "../models/FeedbackForm";
import {Candidate} from "../models/Candidate";
import {Reviewer} from '../models/Reviewer';


@Injectable()
export class ReviewerService {
  comments: FirebaseListObservable<any[]>;
  candidates: FirebaseListObservable<any[]>;
  reviewers: FirebaseListObservable<Reviewer[]>;

  comment: FirebaseObjectObservable<any>;
  matchedComments: FeedbackForm[];

  constructor(public angularfirebase: AngularFireDatabase) {
    this.comments = this.angularfirebase.list('/responses') as FirebaseListObservable<FeedbackForm[]>;
    this.candidates = this.angularfirebase.list('/candidates') as FirebaseListObservable<Candidate[]>;
    this.reviewers = this.angularfirebase.list('/reviewers') as FirebaseListObservable<Reviewer[]>;
    this.matchedComments = [];
  }

  getComments(){
    return this.comments;
  }

  newFeedback(feedback: FeedbackForm) {
    this.comments.push(feedback);
  }

  findReviews(githubId: string){
    console.log("Searching reviews for: " + githubId);
    return this.comments.map(items => {
      // items.forEach(item => {
      //   item.githubId === githubId ? this.matchedComments.push(item) : console.log("not found");
      // });
      const filtered = items.filter(item => item.githubId === githubId);
      return filtered;
      //return this.matchedComments;
    });
  }

  findName(githubId: string){
    return this.candidates.map(items => {
      const filtered = items.filter(item => item.githubID === githubId);
      return filtered;
    })
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
