import {Reviewer} from './Reviewer';
import {Feedback} from "./Feedback";
export interface Candidate {
  $key?: string;
  name?: string;
  email?: string;
  githubID?: string;
  problem?: string;
  repositoryName?: string;
  progressStatus?: string;
  adder?: string;
  reviewers?: string;
  feedback?: string;
}
