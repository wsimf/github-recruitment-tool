import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/operator/do';
import * as _ from 'lodash';
import {ReviewerComment} from "../models/ReviewerComment";

@Injectable()
export class ReviewerService {
  comments: FirebaseListObservable<any[]>;
  comment: FirebaseObjectObservable<any>;

  constructor(public angularfirebase: AngularFireDatabase) {
    this.comments = this.angularfirebase.list('/responses') as FirebaseListObservable<ReviewerComment[]>;
  }

  getComments(){
    return this.comments;
  }

}
