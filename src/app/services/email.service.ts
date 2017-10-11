import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Reviewer} from "../models/Reviewer";
import {Candidate} from "../models/Candidate";
import {Recruiter} from "../models/Recruiter";
import {FeedbackForm} from "../models/FeedbackForm";

@Injectable()
export class EmailService {
  serverUrl = window.location.origin;
  subscription: any;

  constructor(private http: Http) { }

  /***
   * Send an email to the recruiter when the reviewer has submitted feedback
   *
   * @param {Candidate} candidate
   * @param {string} recruiterEmail
   * @param {FeedbackForm} feedback
   */
  sendRecruiterEmail(candidate: Candidate, recruiterEmail: string, feedback: FeedbackForm) {
    // console.log(feedback);

    // From the feedback form, find candidate and recruiter details
    this.subscription = this.http.put(this.serverUrl + '/api/sendgrid/sendRecruiterEmail', {
      candidate: candidate,
      recruiterEmail: recruiterEmail,
      feedback: feedback
    }).subscribe(
      res => {
        // console.log(res);
      },
      err => {
        // console.log(err);
      }
    );
  }

  /***
   * Send an email to the candidate when they are first added to the system
   * to let them know they will soon receive a Github repo invitation
   *
   * @param {Candidate} candidate
   */
  sendCandidateEmail(candidate: Candidate){
    // console.log(candidate);

    this.subscription = this.http.put(this.serverUrl + '/api/sendgrid/sendCandidateEmail', {
      candidate: candidate
    }).subscribe(
      res => {
        // console.log(res);
      },
      err => {
        // console.log(err);
      }
    );
  }

  /***
   * Used to send an email to the development manager to let them know that the Candidate is now finished.
   * The email will contain links for adding a reviewer and giving feedback
   *
   * @param {string} devManagerEmail
   * @param {string} content
   */
  sendDevManagerEmail(devManagerEmail: string, content: string) {
    // console.log("Sending email to dev manager " + devManagerEmail);

    // From feedback, find candidate and recruiter details
    this.subscription = this.http.put(this.serverUrl + '/api/sendgrid/sendDevManagerEmail', {
      email: devManagerEmail,
      content: content
    }).subscribe(
      res => {
        // console.log(res);
      },
      err => {
        // console.log(err);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription != undefined) {
      this.subscription.unsubscribe();
    }
  }

}
