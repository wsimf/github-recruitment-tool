import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Candidate} from '../models/Candidate';
import {Observable} from "rxjs/Observable";

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

}
