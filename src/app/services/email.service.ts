import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
@Injectable()
export class EmailService {

  constructor(private httpClient: HttpClient) { }

  sendEmailtoReviewer() {
    //   console.log('Creating repository');
    //
    //   const headers = new HttpHeaders().set('Authorization', 'token ' + '9f7fa497acff70abc90ea8c4419bd35495615ba0');
    //   const body = {
    //     name: candidate.repositoryName,
    //     description: 'MYOB technical challenge for ' + candidate.name,
    //     private: false,   //False for now since we dont have any private repos for the general acc
    //     has_issues: true,
    //     has_projects: true,
    //     has_wiki: true
    //   };
    //
    //   console.log({headers});
    //   return this.http.post('https://api.github.com/user/repos', body, {headers});
  }
}
