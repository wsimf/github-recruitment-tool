import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {Reviewer} from '../models/Reviewer';
import {Candidate} from '../models/Candidate';
import {FlashMessagesService} from "angular2-flash-messages";

@Injectable()
export class CandidateService {
  candidates: FirebaseListObservable<any[]>;
  candidate: FirebaseObjectObservable<any>;
  can: any[];

  constructor( public angularfirebase: AngularFireDatabase,
               public flashMessageService: FlashMessagesService,) {
    console.log("Initializing candidates");
    this.candidates = this.angularfirebase.list('/candidates') as FirebaseListObservable<Candidate[]>;
    console.log('Retrieved ' + this.candidates.count + ' candidates');
  }

  /**
   * This function returns a list of candidates from the database.
   * @returns {FirebaseListObservable<any[]>}
   */
  getCandidates() {
    return this.candidates;
  }

  /**
   * Find the candidate given the unique key
   * @param {string} key
   * @returns {any}
   */
  findCandidate(key: string) {

    // Get the list of the candidate
    this.getCandidates().subscribe(cand => {
      this.can = cand;
    });
    for (const cand of this.can){
      if (cand.$key === key) {
        return cand;
      }
    }

    // No candidate found
    return null;
  }

  /**
   * Return the candidate with the specified GithubId
   * @param {string} githubId
   * @returns {Observable<any>}
   */
  getCandidateByGithubId(githubId: string) {
    return this.candidates.map(items => {
      // items.forEach(item => {
      //   item.githubId === githubId ? this.matchedComments.push(item) : console.log("not found");
      // });
      const filtered = items.filter(item => item.githubID === githubId);
      return filtered;
      //return this.matchedComments;
    });
  }

  /**
   * Adding new candidate to the candidate list
   * The candidate is persisted in the Firebase Realtime database
   * @param {Candidate} candidate
   */
  newCandidate(candidate: Candidate) {
    this.candidates.push(candidate);
  }
  /**
   * Adding a reviewer to a candidate
   * The review is also persisted in the database.
   * @param {string} githubId
   * @param {string} reviewerGithubID
   * @returns {any}
   */
  addReviewertoCandidate(githubId: string, reviewerGithubId: string ) {
    this.getCandidates().subscribe(cand =>{
      this.can = cand;
    });
    for(let ca of this.can){
      if(ca.githubID != undefined && ca.githubID == githubId){
        if(ca.reviewers == "" || ca.reviewers == undefined){
          ca.reviewers = reviewerGithubId;
          this.candidates.update(ca.$key,ca);

         // Make sure reviewer isn't already added
        }else if (ca.reviewers.indexOf(reviewerGithubId) == -1){
          ca.reviewers += "," + reviewerGithubId;
          this.candidates.update(ca.$key,ca);

        // If reviewer already assigned, display error message
        } else {
          this.flashMessageService.show("This reviewer has already been added", {cssClass: 'alert-danger', timeout: 5000});
        }
        console.log(ca);
        return ca;
      }
    }
  }

  addReviewtoCandidate(githubId: string, reviewId: string ) {
    let firstSubscribe = true;
    this.getCandidates().subscribe(candidates =>{
      if(!firstSubscribe) {return};
      firstSubscribe=false;
      for(let ca of candidates){
        if(ca.githubID != undefined && ca.githubID == githubId){
          if(ca.reviews == "" || ca.reviews == undefined){
            ca.reviews = reviewId;
            this.candidates.update(ca.$key,ca);
          }else{
            ca.reviews += "," + reviewId;
            this.candidates.update(ca.$key,ca);
          }
          return ca;
        }
      }
    });
  }

  /**
   * Get the list of revier given the candidate GithubId
   * @param {string} githubId
   * @returns {any}
   */
  getReviewerList(githubId: string){
    // Get the list of the candidate
    this.getCandidates().subscribe(cand => {
      this.can = cand;
    });

    // Find the reviewers
    for (const ca of this.can){
      if (ca.githubID !== undefined && ca.githubID === githubId){
        if (ca.reviewers !== '' && ca.reviewers !== undefined){
          const viewList = ca.reviewers.split(',');
          return viewList;
        }
      }
    }
  }

  /**
   * Update the status of the candidate
   * @param {string} candidateGithubId
   * @param {string} status
   */
  updateCandidateStatus(key: string, status: string ) {
    this.getCandidates().subscribe(cand => {
      this.can = cand;
    });

    for (const ca of this.can) {
      if (ca.$key === key) {
        ca.progressStatus = status;
        console.log('Change candidate: ' + ca.name + '\'s progress status to ' + status);
        return;
      }
    }
  }

}
