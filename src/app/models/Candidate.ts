import {Reviewer} from './Reviewer';
export interface Candidate {
  $key?: string;
  name?: string;
  email?: string;
  githubID?: string;
  problem?: string;
  repositoryName?: string;
  progressStatus?: string;
  adder?: string;
  reviewers?: string; // comma-separated list of reviewers assigned to this candidate
  reviews?: string;         // comma-separated list of the reviewId of FeedbackForms submitted for this candidate
}
