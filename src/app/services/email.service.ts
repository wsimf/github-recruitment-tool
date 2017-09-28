import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class EmailService {

  constructor(private http: Http) { }

  sendRecruiterEmail(){
    let url = `https://us-central1-nufeproject.cloudfunctions.net/sendEmailtoRecruiter`
    let params: URLSearchParams = new URLSearchParams();
    let headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    params.set('to', 'dpha010@aucklanduni.ac.nz');
    params.set('from', 'nfuseuoa@gmail.com');
    params.set('subject', 'test-email');
    params.set('content', 'Hello World');
    return this.http.post(url, params, headers)
      .toPromise()
      .then( res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }

  sendEmail() {
    const req = this.http.put('http://localhost:80/api/sendgrid/sendEmail', {
      title: 'foo',
      body: 'bar',
      userId: 1
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
