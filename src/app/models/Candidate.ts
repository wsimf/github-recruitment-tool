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
  reviewers?: Reviewer[];
}
