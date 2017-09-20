import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Reviewer} from '../models/Reviewer';
import {Candidate} from '../models/Candidate';
import {Observable} from "rxjs/Observable";
import {of} from "rxjs/observable/of";

interface Repo {
  name: string;
  url: string;
}

@Injectable()
export class CandidateService {
  repos$: Observable<Repo[]>;
  candidates: FirebaseListObservable<any[]>;
  candidate: FirebaseObjectObservable<any>;

  constructor( public angularfirebase: AngularFireDatabase, private http: HttpClient) {
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
  getCandidateList(){ // token: 9f7fa497acff70abc90ea8c4419bd35495615ba0
    console.log('called');
    const headers = new HttpHeaders().set('Authorization', 'token ' + '9f7fa497acff70abc90ea8c4419bd35495615ba0');
    const body = {name: 'This is my repository'};
    console.log({headers});
    // return this.http.post<Repo[]>('https://api.github.com/user/repos', body, {headers});
    return this.http.get<Repo[]>('https://api.github.com/user/repos', {headers});
    // this.repos$ = this.http.get<Repo[]>("https://api.github.com/user/repos", {headers}).map(data => _.values(data)).do(console.log);
    // this.http.get("https://api.github.com/user/repos", {headers}).subscribe(val => console.log(val)); n
  }

}
