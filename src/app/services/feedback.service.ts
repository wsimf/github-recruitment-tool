import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {Reviewer} from '../models/Reviewer';
import {Candidate} from '../models/Candidate';
import {Feedback} from "../models/Feedback";
import { CandidateService} from "./candidate.service";

@Injectable()
export class FeedbackService {
  feedbacks: FirebaseListObservable<any[]>;
  feedback: FirebaseObjectObservable<any>;
  candidates: FirebaseListObservable<any[]>;
  candidate: FirebaseObjectObservable<any>;
  // feedbackTable : any[];
  feedbackList: Array<Feedback>;
  can: any[];

  constructor(public angularfirebase: AngularFireDatabase  /*, public candidateService: CandidateService*/) {
    this.feedbacks= this.angularfirebase.list('/feedbacks') as FirebaseListObservable<Feedback[]>;
    this.candidates = this.angularfirebase.list('/candidates') as FirebaseListObservable<Candidate[]>;
  }

  getFeedbacks() {
    return this.feedbacks;
  }

  getCandidateFeedback (candidateGithub: string) {
    this.feedbackList = new Array<Feedback>();
    this.feedbacks.forEach(feedbackTable =>{
      for(let feedback of feedbackTable){
        if (feedback.candidateGithub === candidateGithub) {
          console.log("matched ");
          console.log(feedback);
          this.feedbackList.push(feedback);
          console.log(this.feedbackList.length);
          }
      }
    });
    console.log(this.feedbackList);
    return this.feedbackList;
  }

  newFeedback(feedback: Feedback) {
    this.feedbacks.push(feedback);

    // Add feedback to the candidate, currently it adds the feedbackID
    this.candidate = this.addFeedbacktoCandidate(feedback.candidateGithub, feedback.feedbackID);

  }

  addFeedbacktoCandidate(githubId: string, feedbackID: string) {

    this.candidates.subscribe(cand =>{
      this.can = cand;
    });

    for(let ca of this.can){
      if(ca != undefined && ca.githubID != undefined && ca.githubID == githubId){
        if(ca.feedback == undefined || ca.feedback == ""){
          ca.feedback = feedbackID;
          this.candidates.update(ca.$key,ca);
        } else {
          ca.feedback += "," + feedbackID;
          this.candidates.update(ca.$key,ca);
        }
        return ca;
      }
    }
  }

}
