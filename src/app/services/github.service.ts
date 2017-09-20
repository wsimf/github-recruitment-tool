import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Candidate} from "../models/Candidate";

interface Repo {
  name: string;
  url: string;
}

@Injectable()
export class GithubService {

  constructor(private http: HttpClient) { }

  addCandidate(candidate: Candidate) {
    this.createRepository(candidate).subscribe(data => {
      this.importRepository(data);
    });
  }
  createRepository(candidate: Candidate) {
    console.log('Creating repository');

    const headers = new HttpHeaders().set('Authorization', 'token ' + '9f7fa497acff70abc90ea8c4419bd35495615ba0');
    const body = {
      name: 'code-challenge-' + candidate.githubID,
      description: 'MYOB technical challenge for ' + candidate.name,
      homepage: 'https://github.com',
      private: false,   //False for now since we dont have any private repos for the general acc
      has_issues: true,
      has_projects: true,
      has_wiki: true
    };

    console.log({headers});
    return this.http.post('https://api.github.com/user/repos', body, {headers});
  }

  importRepository(response: any) {
    console.log(response);
  }

  getCandidateList() { // token: 9f7fa497acff70abc90ea8c4419bd35495615ba0
    console.log('called');
    const headers = new HttpHeaders().set('Authorization', 'token ' + '9f7fa497acff70abc90ea8c4419bd35495615ba0');
    const body = {name: 'This is my repository'};
    console.log({headers});
    // return this.http.post<Repo[]>('https://api.github.com/user/repos', body, {headers});
    return this.http.get<Repo[]>('https://api.github.com/user/repos', {headers});
    // this.repos$ = this.http.get<Repo[]>("https://api.github.com/user/repos", {headers}).map(data => _.values(data)).do(console.log);
    // this.http.get("https://api.github.com/user/repos", {headers}).subscribe(val => console.log(val));
  }

}
