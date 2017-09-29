export interface ReviewerComment {
  $key?: string;
  candidateGithubID?: string;
  candidateGithubName?: string;
  candidateEmail?: string;
  reviewerName?: string;
  commentToRecruiter?: string;
  commentToCandidate?: string;
  timestamp?: string;
}
