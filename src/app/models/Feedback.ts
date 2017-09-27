export  class Feedback {
  $key?: string;
  candidateGithub?: string; //get this from parameter in the url, actually im not sure if we need this, since we will save the Feedback object to a Candidate, probably keep it just in case
  reviewerGithub?: string;  //get this from parameter in the url
  feedbackID?: string;
  solution?: string;
  solutionslide?: number;
  concerns?: string;
  concernsslide?: number;
  readability?: string;
  readabilityslide?: number;
  knowledge?: string;
  knowledgeslide?: number;
  comprehensive?: string;
  comprehensiveslide?: number;
  quality?: string;
  qualityslide?: number;
  summary?: string;
  recommend?: string
}
