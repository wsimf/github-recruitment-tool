import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import { Recruiter} from "../models/Recruiter";

@Injectable()
export class RecruiterService {
  recruiters: FirebaseListObservable<Recruiter[]>;
  constructor(public angularfirebase: AngularFireDatabase) {
    this.recruiters = this.angularfirebase.list('/recruiters') as FirebaseListObservable<Recruiter[]>;
  }

  getRecruiters() {
    return this.recruiters;
  }

  persistRecruiter(recruiter: Recruiter) {
    this.recruiters.push(recruiter);
  }

}
