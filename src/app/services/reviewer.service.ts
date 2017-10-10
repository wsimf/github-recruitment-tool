import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import 'rxjs/add/operator/do';
import {FeedbackForm} from "../models/FeedbackForm";
import {Candidate} from "../models/Candidate";
import {Reviewer} from '../models/Reviewer';
import {EmailService} from "./email.service";
import {Recruiter} from "../models/Recruiter";


@Injectable()
export class ReviewerService {
  comments: FirebaseListObservable<any[]>;
  candidates: FirebaseListObservable<any[]>;
  reviewers: FirebaseListObservable<Reviewer[]>;
  recruiters: FirebaseListObservable<Recruiter[]>;

  comment: FirebaseObjectObservable<any>;
  matchedComments: FeedbackForm[];
  private c: Candidate;
  private rc: Recruiter;
  private rv: Reviewer;

  constructor(public angularfirebase: AngularFireDatabase, public emailService: EmailService) {
    this.comments = this.angularfirebase.list('/responses') as FirebaseListObservable<FeedbackForm[]>;
    this.candidates = this.angularfirebase.list('/candidates') as FirebaseListObservable<Candidate[]>;
    this.reviewers = this.angularfirebase.list('/reviewers') as FirebaseListObservable<Reviewer[]>;
    this.recruiters = this.angularfirebase.list('/recruiters') as FirebaseListObservable<Recruiter[]>;
    this.matchedComments = [];
  }

  getComments(){
    return this.comments;
  }

  newFeedback(feedback: FeedbackForm) {
    this.comments.push(feedback);
    console.log(feedback);
    var firstSubscribe = true;
    this.findName(feedback.githubId).subscribe( res => {
      if(!firstSubscribe){
        return;
      }
      firstSubscribe = false;
      this.c = res[0];
      console.log("this.c is: " +this.c);
      this.emailService.sendRecruiterEmail(this.c, this.c.adder , feedback);
    }) ; // find candidate


    // this.rv = this.findReviewer(feedback.reviewerGithub);
    // this.emailService.sendRecruiterEmail(this.c, this.rc , feedback);
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

  findName(githubId: string){
    return this.candidates.map(items => {
      const filtered = items.filter(item => item.githubID === githubId);
      return filtered;
    })
  }

  findRecruiter(recruiterName: string) {
    return this.recruiters.map( recruiters => {
      const recruiter = recruiters.filter( r => r.name === recruiterName);
      return recruiter;
    })
  }


  getReviewers() {
    return this.reviewers;
  }

  persistReviewer(reviewer: Reviewer) {
    console.log("Adding reviewer: " + reviewer.name);
    let reviewer2 = this.findReviewer(reviewer.githubID);
    if (reviewer2 == null) {
      this.reviewers.push(reviewer);
    }

  }

  findReviewer(githubID: string) {
    this.reviewers.forEach(function(reviewer: Reviewer){
      if (reviewer.githubID === githubID) {
        return reviewer;
      }
    });
    // no candidate found
    return null;
  }
}
