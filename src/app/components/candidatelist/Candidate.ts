import {Reviewer} from './Reviewer';
export interface Candidate {
  name: string;
  email: string;
  githubID: string;
  progressStatus: string;
  adder: string;
  reviewers: Reviewer[];
}
