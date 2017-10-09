import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {Reviewer} from '../models/Reviewer';
import {Candidate} from '../models/Candidate';
import {FlashMessagesService} from "angular2-flash-messages";

@Injectable()
export class CandidateService {
  candidates: FirebaseListObservable<any[]>;
  candidate: FirebaseObjectObservable<any>;
  can : any[];

  constructor( public angularfirebase: AngularFireDatabase,
               public flashMessageService: FlashMessagesService,) {
    console.log("Initializing candidates");
    this.candidates = this.angularfirebase.list('/candidates') as FirebaseListObservable<Candidate[]>;
    // console.log("Retrieved " + this.candidates.count + " candidates");   // candidates not available yet - async
  }

  getCandidates() {
    return this.candidates;
  }

  editCandidate(id:string,candidate:Candidate){
    return this.candidates.update(id,candidate);
  }
  // These three methods are not used anywhere, consider deleting
/*  getCandidate(key: string) {
    this.candidate = this.findCandidate(key);
    return this.candidate;
  }

  findCandidate(key: string) {
    this.candidates.forEach(function(cand: Candidate){
      if (cand.$key === key) {
        return cand;
      }
    });
    // no candidate found
    return null;
  }

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
*/

  newCandidate(candidate: Candidate) {
    this.candidates.push(candidate);
  }

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
          console.log(ca);
          return ca;
        }
      }
      return null;
    });
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

  getReviewerList(githubId: string) {
    // Get the list of the candidate
    this.getCandidates().subscribe(cand => {
      this.can = cand;
    });

    // Find the reviewers
    for(let ca of this.can){
      if(ca.githubID != undefined && ca.githubID == githubId){
        if(ca.reviewers != "" && ca.reviewers != undefined){
          var viewList = ca.reviewers.split(',');
          return viewList;
        }
      }
    }
  }

  deleteCand(cand: Candidate) {
    this.candidates.remove(cand.$key);
  }
}
