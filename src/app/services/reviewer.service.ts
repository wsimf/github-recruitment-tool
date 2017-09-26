import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/operator/do';
import * as _ from 'lodash';
import {ReviewerComment} from "../models/ReviewerComment";
import {FeedbackForm} from "../models/FeedbackForm";

@Injectable()
export class ReviewerService {
  comments: FirebaseListObservable<any[]>;
  comment: FirebaseObjectObservable<any>;
  matchedComments: FeedbackForm[];

  constructor(public angularfirebase: AngularFireDatabase) {
    this.comments = this.angularfirebase.list('/responses') as FirebaseListObservable<FeedbackForm[]>;
    this.matchedComments = [];
  }

  getComments(){
    return this.comments;
  }

  newFeedback(feedback: FeedbackForm) {
    this.comments.push(feedback);
  }

  findReviews(githubId: string){
    this.comments.forEach(function (review: FeedbackForm) {
      console.log(review);
      for (let entry in review) {
        if (review[entry].githubId === githubId){
          console.log(review[entry]);
          this.matchedComments.push(review[entry]);
        }
      }
    });
    if (this.matchedComments.length > 0){
      return this.matchedComments;
    } else {
      return null;
    }
  }

  // findCandidate(key: string) {
  //   this.candidates.forEach(function(cand: Candidate){
  //     if (cand.$key === key) {
  //       return cand;
  //     }
  //   });
  //   // no candidate found
  //   return null;
  // }

}
