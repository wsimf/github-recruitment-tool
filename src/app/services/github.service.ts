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

interface GithubUser {
  name: string;
  email: string;
}

@Injectable()
export class GithubService {

  constructor(private http: HttpClient) { }

  /**
   * Create a repository and add the candidate as a collabrorator
   * @param {Candidate} candidate
   */
  addCandidate(candidate: Candidate) {
    this.createRepository(candidate).subscribe(data => {
      this.importRepository(data, candidate).subscribe( res => {
        this.addCollaborator(data['name'], candidate.githubID).subscribe(res =>{
          // console.log(res);
        });
      });
    });
  }

  /**
   * Create a new repository for candidate
   * @param {Candidate} candidate
   * @returns {Observable<Object>}
   */
  createRepository(candidate: Candidate) {
    // console.log('Creating repository 123');
    const headers = new HttpHeaders().set('Authorization', 'token ' + '9f7fa497acff70abc90ea8c4419bd35495615ba0');
    const body = {
      name: candidate.repositoryName,
      description: 'MYOB technical challenge for ' + candidate.name,
      private: false,   //False for now since we dont have any private repos for the general acc
      has_issues: true,
      has_projects: true,
      has_wiki: true
    };

    // console.log({headers});
    return this.http.post('https://api.github.com/user/repos', body, {headers});
  }

  // Clone repository
  importRepository(response: any, candidate: Candidate) {
    // console.log(response);
    // console.log('Importing repository');
    const headers = new HttpHeaders().set('Authorization', 'token ' + '9f7fa497acff70abc90ea8c4419bd35495615ba0').set('Accept', 'application/vnd.github.barred-rock-preview');
    const body = {
      vcs: "git",
      vcs_url: 'https://github.com/nfuseuoa/' + candidate.problem + '.git'
    };

    // console.log({headers});
    return this.http.put('https://api.github.com/repos/nfuseuoa/' + response["name"] + '/import', body, {headers});
  }

  /**
   * Add github user as collaborator
   * @param {string} name
   * @param {string} collaborator
   * @returns {Observable<Object>}
   */
  addCollaborator(name: string, collaborator: string) {
    // console.log('Adding a collaborator');
    const headers = new HttpHeaders().set('Authorization', 'token ' + '9f7fa497acff70abc90ea8c4419bd35495615ba0')
      .set('Accept', 'application/vnd.github.barred-rock-preview');
    // console.log(name + '  ' + collaborator);
    return this.http.put('https://api.github.com/repos/nfuseuoa/' + name + '/collaborators/' + collaborator, null, {headers});
  }

  /**
   * Get a list of repositories from user account
   * @returns {Observable<Object>}
   */
  getCandidateList() { // token: 9f7fa497acff70abc90ea8c4419bd35495615ba0
    // console.log('called');
    const headers = new HttpHeaders().set('Authorization', 'token ' + '9f7fa497acff70abc90ea8c4419bd35495615ba0');
    const body = {name: 'This is my repository'};
    // console.log({headers});
    return this.http.get<Repo[]>('https://api.github.com/user/repos', {headers});
  }

  /**
   * Get user details from Github
   * @param {string} githubId
   * @returns {Observable<Object>}
   */
  getUser(githubId: string) {
    console.log("Getting user details from GitHub...");
    const headers = new HttpHeaders().set('Authorization', 'token ' + '9f7fa497acff70abc90ea8c4419bd35495615ba0');
    return this.http.get<GithubUser>('https://api.github.com/users/' + githubId, {headers});
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

  /**
   * Remove the reviewer from the candidate's repo
   * @param {string} repoName
   * @param {string} reviewerGithubID
   * @returns {Subscription}
   */
  removeReviewerFromRepo(repoName: string, reviewerGithubID: string){
    console.log('Removing ' + reviewerGithubID + ' from ' + repoName);
    const headers = new HttpHeaders().set('Authorization', 'token ' + '9f7fa497acff70abc90ea8c4419bd35495615ba0')
      .set('Accept', 'application/vnd.github.barred-rock-preview');
    return this.http.delete('https://api.github.com/repos/nfuseuoa/' +
      repoName + '/collaborators/' + reviewerGithubID,  {headers}).subscribe((ok) => {console.log(ok); } );
  }

}
