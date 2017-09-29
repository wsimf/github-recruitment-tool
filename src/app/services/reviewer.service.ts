import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import 'rxjs/add/operator/do';
import {FeedbackForm} from "../models/FeedbackForm";
import {Candidate} from "../models/Candidate";
import {CandidateService} from "./candidate.service";

@Injectable()
export class ReviewerService {
  comments: FirebaseListObservable<any[]>;
  candidates: FirebaseListObservable<any[]>;

  comment: FirebaseObjectObservable<any>;
  matchedComments: FeedbackForm[];

  constructor(public angularfirebase: AngularFireDatabase, public candidateService: CandidateService) {
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

  updateReviewStatus(candidates : Candidate[]){
    for (let candidate of candidates){
      this.comments.subscribe(items => {
        const filtered = items.filter(item => item.githubId === candidate.githubID);
        if (candidate.reviewers === undefined || candidate.reviewers.length === 0){
          candidate.progressStatus = 'Doing';
        } else if (filtered.length === 0){
          candidate.progressStatus = 'Being Reviewed';
        }else if (filtered.length === candidate.reviewers.length){
          candidate.progressStatus = 'Reviewing Completed';
        }else{
          candidate.progressStatus = filtered.length + '/' + candidate.reviewers.length + ' Reviews Finished';
        }
      });
      this.candidateService.updateCandidates(candidate);
    }
  }

  findName(githubId: string){
    return this.candidates.map(items => {
      const filtered = items.filter(item => item.githubID === githubId);
      return filtered;
    });
  }



}
