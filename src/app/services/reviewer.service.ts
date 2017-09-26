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
    console.log("Searching for: " + githubId);
    return this.comments.map(items => {
      items.forEach(item => {
        item.githubId === githubId ? this.matchedComments.push(item) : console.log("not found");
      });
      return this.matchedComments;
    });
  }



}
