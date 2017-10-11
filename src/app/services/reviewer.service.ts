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
  private candidate: Candidate;

  constructor(public angularfirebase: AngularFireDatabase, public emailService: EmailService) {
    this.comments = this.angularfirebase.list('/responses') as FirebaseListObservable<FeedbackForm[]>;
    this.candidates = this.angularfirebase.list('/candidates') as FirebaseListObservable<Candidate[]>;
    this.reviewers = this.angularfirebase.list('/reviewers') as FirebaseListObservable<Reviewer[]>;
    this.recruiters = this.angularfirebase.list('/recruiters') as FirebaseListObservable<Recruiter[]>;
    this.matchedComments = [];
  }

  /***
   * Return all feedback comments
   *
   * @returns {FirebaseListObservable<any[]>}
   */
  getComments(){
    return this.comments;
  }

  /***
   * Persist the feedback, update candidate to reflect new feedback, and email recruiter to inform them about this
   *
   * @param {FeedbackForm} feedback
   */
  newFeedback(feedback: FeedbackForm) {
    // Persist the feedback into the database
    this.comments.push(feedback);
    // console.log(feedback);

    var firstSubscribe = true;
    this.findCandidate(feedback.githubId).subscribe(candidate => {
      if(!firstSubscribe){
        return;
      }
      firstSubscribe = false;
      this.candidate = candidate[0];
      // console.log("this.candidate is: " +this.candidate);
      this.emailService.sendRecruiterEmail(this.candidate, this.candidate.adder , feedback);
    });
  }

  /***
   * Find and return all feedback reviews submitted for the candidate with a given github Id
   *
   * @param {string} githubId
   * @returns {Observable<any>}
   */
  findReviews(githubId: string){
    // console.log("Searching reviews for: " + githubId);
    return this.comments.map(items => {
      const filtered = items.filter(item => item.githubId === githubId);
      return filtered;
    });
  }

  /***
   * Find candidate by Github Id
   *
   * @param {string} githubId
   * @returns {Observable<any>}
   */
  findCandidate(githubId: string){
    return this.candidates.map(items => {
      const filtered = items.filter(item => item.githubID === githubId);
      return filtered;
    })
  }

  /***
   * Find recruiter by their name
   *
   * @param {string} recruiterName
   * @returns {Observable<any>}
   */
  findRecruiter(recruiterName: string) {
    return this.recruiters.map( recruiters => {
      const recruiter = recruiters.filter( r => r.name === recruiterName);
      return recruiter;
    })
  }

  /***
   * Returns all reviewers
   *
   * @returns {FirebaseListObservable<Reviewer[]>}
   */
  getReviewers() {
    return this.reviewers;
  }

  /***
   * Persist a new reviewer into the database
   *
   * @param {Reviewer} reviewer
   */
  persistReviewer(reviewer: Reviewer) {
    // console.log("Adding reviewer: " + reviewer.name);
    //Check if reviewer already exists in the database, otherwise don't persist
    let savedReviewer = this.findReviewer(reviewer.githubID);
    if (savedReviewer == null) {
      this.reviewers.push(reviewer);
    }

  }

  /***
   * Find and return a reviewer by their Github Id
   *
   * @param {string} githubID
   * @returns {any}
   */
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
