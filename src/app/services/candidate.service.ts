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
               public flashMessageService: FlashMessagesService ) {
    // console.log("Initializing candidates");
    this.candidates = this.angularfirebase.list('/candidates') as FirebaseListObservable<Candidate[]>;
  }

  /**
   * Get all candidate from FBDB
   * @returns {FirebaseListObservable<any[]>}
   */
  getCandidates() {
    return this.candidates;
  }

  /**
   * Get a single candidate from FBDB using a key
   * @param {string} id
   * @returns {FirebaseObjectObservable<any>}
   */
  getCandidate(id: string) {
    this.candidate = this.angularfirebase.object('/candidates/' + id) as FirebaseObjectObservable<Candidate>;
    return this.candidate;
  }

  /**
   * Update the status of the candidate
   * @param {Candidate} candidate
   */
  updateCandidate(cand: Candidate) {
    this.candidates.update(cand.$key, cand);
  }

  /**
   * Add new candidate to the candidate list
   * @param {Candidate} candidate
   */
  newCandidate(candidate: Candidate) {
    this.candidates.push(candidate);
  }

  /**
   * Adding reviewer to candidate and persist the information in FBDB
   * @param {string} githubId
   * @param {string} reviewerGithubId
   */
  addReviewertoCandidate(githubId: string, reviewerGithubId: string ) {
    let firstSubscribe = true;

    this.getCandidates().subscribe(cand =>{
      if(!firstSubscribe) {return}
      firstSubscribe = false;
      this.can = cand;

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
          //console.log(ca);
          return ca;
        }
      }
      return null;
    });
  }

  /**
   * Add a reviewer to the candidate and persist in FBDB
   * @param {string} githubId
   * @param {string} reviewId
   */
  addReviewtoCandidate(githubId: string, reviewId: string ) {
    let firstSubscribe = true;
    this.getCandidates().subscribe(candidates =>{
      if(!firstSubscribe) {return};
      firstSubscribe=false;
      for(let candidate of candidates){
        if(candidate.githubID != undefined && candidate.githubID == githubId){
          if(candidate.reviews == "" || candidate.reviews == undefined){
            candidate.reviews = reviewId;
            this.candidates.update(candidate.$key,candidate);
          }else{
            candidate.reviews += "," + reviewId;
            this.candidates.update(candidate.$key,candidate);
          }
          return candidate;
        }
      }
    });
  }

  /**
   * This function return an array of string contains the name of reviewers
   * @param {string} githubId
   * @returns {string[]}
   */
  getReviewerList(githubId: string) {
    // Get the list of the candidate
    this.getCandidates().subscribe(candidate => {
      this.can = candidate;
    });

    // Find the reviewers
    for(let candidate of this.can){
      if(candidate.githubID != undefined && candidate.githubID == githubId){
        if(candidate.reviewers != "" && candidate.reviewers != undefined){
          var viewList = candidate.reviewers.split(',');
          return viewList;
        }
      }
    }
  }

  /**
   * Delete the candidate from the
   * @param {Candidate} candidate
   */
  deleteCand(candidate: Candidate) {
    this.candidates.remove(candidate.$key);
  }
}
