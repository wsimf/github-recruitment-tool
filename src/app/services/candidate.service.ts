import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {Reviewer} from '../models/Reviewer';
import {Candidate} from '../models/Candidate';

@Injectable()
export class CandidateService {
  candidates: FirebaseListObservable<any[]>;
  candidate: FirebaseObjectObservable<any>;

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

  addReviewertoCandidate(candidateID: string, reviewer: Reviewer ) {
    // this.candidates.forEach(function(cand: Candidate[]){

      // this.candidates.forEach(obj => {
      //   console.log(cand.name);
      //   if (obj.$key === candidateID) {
      //     console.log(candidateID);
      //     cand.reviewers.push(reviewer);
      //   }
      //   );
      //   }
  }

}
