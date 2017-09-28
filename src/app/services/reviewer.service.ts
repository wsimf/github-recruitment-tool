import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import 'rxjs/add/operator/do';
import {FeedbackForm} from "../models/FeedbackForm";
import {Candidate} from "../models/Candidate";

@Injectable()
export class ReviewerService {
  comments: FirebaseListObservable<any[]>;
  candidates: FirebaseListObservable<any[]>;

  comment: FirebaseObjectObservable<any>;
  matchedComments: FeedbackForm[];

  constructor(public angularfirebase: AngularFireDatabase) {
    this.comments = this.angularfirebase.list('/responses') as FirebaseListObservable<FeedbackForm[]>;
    this.candidates = this.angularfirebase.list('/candidates') as FirebaseListObservable<Candidate[]>;

    this.matchedComments = [];
  }

  getComments(){
    return this.comments;
  }

  newFeedback(feedback: FeedbackForm) {
    this.comments.push(feedback);
  }

  findReviews(githubId: string){
    console.log("Searching for: " + githubId);
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



}
