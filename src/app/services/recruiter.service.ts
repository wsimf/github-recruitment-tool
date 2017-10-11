import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import { Recruiter} from "../models/Recruiter";

@Injectable()
export class RecruiterService {
  recruiters: FirebaseListObservable<Recruiter[]>;
  constructor(public angularfirebase: AngularFireDatabase) {
    this.recruiters = this.angularfirebase.list('/recruiters') as FirebaseListObservable<Recruiter[]>;
  }

  /***
   * Return the full list of recruiters
   *
   * @returns {FirebaseListObservable<Recruiter[]>}
   */
  getRecruiters() {
    return this.recruiters;
  }

  /***
   * persist a new recruiter into the database
   *
   * @param {Recruiter} recruiter
   */
  persistRecruiter(recruiter: Recruiter) {
    this.recruiters.push(recruiter);
  }
}
