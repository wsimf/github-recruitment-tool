import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {Reviewer} from '../models/Reviewer';
import {Candidate} from '../models/Candidate';

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
        if(ca.reviewers == "" || ca.reviewers == undefined){
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

  getReviewerList(githubId: string){
    // Get the list of the candidate
    this.getCandidates().subscribe(cand =>{
      this.can = cand;
    });

    // Find the reviewers
    for(let ca of this.can){
      if(ca.githubID != undefined && ca.githubID == githubId){
        if(ca.reviewers != "" && ca.reviewers != undefined){
          var viewList = ca.reviewers.split(',');
          return viewList;
        }
      }
    }
  }
}
