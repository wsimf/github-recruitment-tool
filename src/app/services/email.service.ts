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

  constructor(private http: Http) { }

  // sendRecruiterEmail(){
  //   let url = `https://us-central1-nufeproject.cloudfunctions.net/sendEmailtoRecruiter`
  //   let params: URLSearchParams = new URLSearchParams();
  //   let headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  //   params.set('to', 'dpha010@aucklanduni.ac.nz');
  //   params.set('from', 'nfuseuoa@gmail.com');
  //   params.set('subject', 'test-email');
  //   params.set('content', 'Hello World');
  //   return this.http.post(url, params, headers)
  //     .toPromise()
  //     .then( res => {
  //       console.log(res)
  //     })
  //     .catch(err => {
  //       console.log(err)
  //     })
  // }

  sendReviewerEmail(reviewer: Reviewer) {
    console.log(reviewer);
    const req = this.http.put('http://localhost:80/api/sendgrid/sendReviewerEmail', {
      reviewer: reviewer
    }).subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log(err);
        }
      );
  }

  sendCandidateEmail(candidate: Candidate){
    console.log(candidate);
    const req = this.http.put('http://localhost:80/api/sendgrid/sendCandidateEmail', {
      candidate: candidate
    }).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
  }

  sendRecruiterEmail(candidate: Candidate, recruiter: Recruiter, feedback: FeedbackForm) {
    console.log(feedback);

    // From feedback, find candidate and recruiter details

    const req = this.http.put('http://localhost:80/api/sendgrid/sendRecruiterEmail', {
      candidate: candidate,
      recruiter: recruiter,
      // reviewer: reviewer,
      feedback: feedback
    }).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
  }
  // sendEmail() {
  //   gapi.client.init(){
  //
  //     'clientId':'763732167157-5fto94ei2iv80kb3g1qplft1vtilkn5l.apps.googleusercontent.com',
  //       'discoveryDocs' : ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
  //       'scope' : 'https://www.googleapis.com/auth/gmail.send',
  //   }).then(function () {});
  // }
  // sendEmailtoReviewer() {
  //   //   console.log('Creating repository');
  //   //
  //   //   const headers = new HttpHeaders().set('Authorization', 'token ' + '9f7fa497acff70abc90ea8c4419bd35495615ba0');
  //   //   const body = {
  //   //     name: candidate.repositoryName,
  //   //     description: 'MYOB technical challenge for ' + candidate.name,
  //   //     private: false,   //False for now since we dont have any private repos for the general acc
  //   //     has_issues: true,
  //   //     has_projects: true,
  //   //     has_wiki: true
  //   //   };
  //   //
  //   //   console.log({headers});
  //   //   return this.http.post('https://api.github.com/user/repos', body, {headers});
  // }
}
