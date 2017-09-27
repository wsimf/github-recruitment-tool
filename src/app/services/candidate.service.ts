import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {Reviewer} from '../models/Reviewer';
import {Candidate} from '../models/Candidate';
import {Feedback} from "../models/Feedback";

@Injectable()
export class CandidateService {
  candidates: FirebaseListObservable<any[]>;
  candidate: FirebaseObjectObservable<any>;
  can : any[];

  constructor( public angularfirebase: AngularFireDatabase) {
    this.candidates = this.angularfirebase.list('/candidates') as FirebaseListObservable<Candidate[]>;
  }

  getCandidates() {
    return this.candidates;
  }

  getCandidate(key: string) {
    this.candidate = this.findCandidate(key);
    return this.candidate;
  }

  findCandidate(key: string) {
    this.candidates.forEach(function(cand: Candidate){
      if (cand.$key === key) {
        return cand;
      }
    });
    // no candidate found
    return null;
  }

  newCandidate(candidate: Candidate) {
    this.candidates.push(candidate);
  }

  addReviewertoCandidate(githubId: string, reviewerGithubID: string ) {
    this.getCandidates().subscribe(cand =>{
      this.can = cand;
    });
    for(let ca of this.can){
      console.log(ca);
      if(ca.githubID != undefined && ca.githubID == githubId){
        if(ca.reviewers == undefined || ca.reviewers == ""){
          console.log("1-1");
          ca.reviewers = reviewerGithubID;
          this.candidates.update(ca.$key,ca);
          //this.candidates.update(githubId,ca);
        }else{
          console.log("1-2");
          ca.reviewers += "," + reviewerGithubID;
          this.candidates.update(ca.$key,ca);
        }
        return ca;
      }
    }
  }

  addFeedbacktoCandidate(githubId: string, feedbackID: string) {

    this.getCandidates().subscribe(cand =>{
      this.can = cand;

      setTimeout(function() {

        console.log("cand undefined? " + (cand == undefined));
        // cand is undefined!!! why?
        console.log("this.can undefined? " + (this.can == undefined));
        for(let ca of cand){

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
      }, 2000);
    });





  }

  getFeedbackList(githubId: string){
    // Get the list of the candidate
    this.getCandidates().subscribe(cand =>{
      this.can = cand;
    });

    // Find the feedback IDs
    for(let ca of this.can){
      if(ca.githubID != undefined && ca.githubID == githubId){
        if(ca.feedback != undefined && ca.feedback != ""){
          var feedbackList = ca.feedback.split(',');
          return feedbackList;
        }
      }
    }
  }

  getReviewerList(githubId: string){
    // Get the list of the candidate
    this.getCandidates().subscribe(cand =>{
      this.can = cand;
    });

    // Find the reviewers
    for(let ca of this.can){
      if(ca.githubID != undefined && ca.githubID == githubId){
        if(ca.reviewers != undefined && ca.reviewers != ""){
          var viewList = ca.reviewers.split(',');
          return viewList;
        }
      }
    }
  }
}
