import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Candidate} from "../models/Candidate";

interface Repo {
  name: string;
  url: string;
  full_name: string;
  subscribers_url: string;
}

@Injectable()
export class GithubService {

  constructor(private http: HttpClient) { }

  // Create a repo for a candidate
  addCandidate(candidate: Candidate) {
    this.createRepository(candidate).subscribe(data => {
      this.importRepository(data, candidate).subscribe( res => {
        this.addCollaborator(data['name'], candidate.githubID).subscribe(res =>{
          console.log(res);
        });
      });
    });
  }
  // Create a repository for a candidate
  createRepository(candidate: Candidate) {
    console.log('Creating repository');

    const headers = new HttpHeaders().set('Authorization', 'token ' + '9f7fa497acff70abc90ea8c4419bd35495615ba0');
    const body = {
      name: candidate.repositoryName,
      description: 'MYOB technical challenge for ' + candidate.name,
      private: false,   //False for now since we dont have any private repos for the general acc
      has_issues: true,
      has_projects: true,
      has_wiki: true
    };

    console.log({headers});
    return this.http.post('https://api.github.com/user/repos', body, {headers});
  }

  // Clone repository
  importRepository(response: any, candidate: Candidate) {
    console.log(response);

    console.log('Importing repository');

    const headers = new HttpHeaders().set('Authorization', 'token ' + '9f7fa497acff70abc90ea8c4419bd35495615ba0').set('Accept', 'application/vnd.github.barred-rock-preview');
    const body = {
      vcs: "git",
      vcs_url: 'https://github.com/nfuseuoa/' + candidate.problem + '.git'
    };

    console.log({headers});
    return this.http.put('https://api.github.com/repos/nfuseuoa/' + response["name"] + '/import', body, {headers});
  }

  // Add colabrorator to a github repo
  addCollaborator(name: string, collaborator: string) {
    console.log('Adding a collaborator');
    const headers = new HttpHeaders().set('Authorization', 'token ' + '9f7fa497acff70abc90ea8c4419bd35495615ba0')
      .set('Accept', 'application/vnd.github.barred-rock-preview');
    console.log(name + '  ' + collaborator);
    return this.http.put('https://api.github.com/repos/nfuseuoa/' + name + '/collaborators/' + collaborator, null, {headers});
    // return this.http.put('https://api.github.com/repos/nfuseuoa/code-challenge-'
    //   + collaborator + '/collaborators/' + collaborator, null, {headers});
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

  /**
   * This function remove candidate from the repo
   * This event happens when a reviewer is added to the repo
   * @param {Candidate} candidate
   * @returns {Subscription}
   */
  removeCandidateFromRepo(candidate: Candidate) {
    console.log('Removing ' + candidate.name +' from ' + candidate.repositoryName);
    const headers = new HttpHeaders().set('Authorization', 'token ' + '9f7fa497acff70abc90ea8c4419bd35495615ba0')
      .set('Accept', 'application/vnd.github.barred-rock-preview');
    return this.http.delete('https://api.github.com/repos/nfuseuoa/' +
      candidate.repositoryName + '/collaborators/' + candidate.githubID,  {headers}).subscribe((ok) => {console.log(ok); } );
  }
}
