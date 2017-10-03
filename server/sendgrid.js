const express = require('express');
const sgMail = require('@sendgrid/mail');
const router = express.Router();
// const typescriptRequire = require('typescript-require');
// var addCandComponent = require('../src/app/components/add-cand.component.ts');

router.put('/sendReviewerEmail', (req, res) => {
  console.log("Sending email to reviewer: " + req.body.reviewer.name);
  sgMail.setApiKey('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');
  // console.log(req.body.reviewer);
  const msg = {
    to: req.body.reviewer.email,
    from: 'nfuseuoa@gmail.com',
    subject: 'You have been assigned a new Candidate to review!',
    text: 'You will receive an invitation to a GitHub repository with the candidates solution. Fill in comments here: http://localhost:80/nfuse/feedback'
  };
  sgMail.send(msg);

})

router.put('/sendCandidateEmail', (req, res) => {
  console.log("Sending email to candidate: " + req.body.candidate.name);
  sgMail.setApiKey('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');
  const msg = {
    to: req.body.candidate.email,
    from: 'nfuseuoa@gmail.com',
    subject: 'MYOB Technical Assessment',
    text: 'You have been invited to do a challenge to assess your technical capabilities.' +
    'You will receive an invitation to a GitHub repository which will contain further instructions'
  };
  sgMail.send(msg);

  // setTimeout(function() {
  //   addCandComponent;
  // }, 15000);


})

router.put('/sendRecruiterEmail', (req, res) => {
  console.log("Sending email to recruiter: " + req.body.recruiterEmail);
  sgMail.setApiKey('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');
  // console.log(req.body.recruiter);
  const msg = {
    to: req.body.recruiterEmail,
    from: 'nfuseuoa@gmail.com',
    subject: 'A review has been completed for ' + req.body.candidate.name,
    text: JSON.stringify(req.body.feedback)
  };
  sgMail.send(msg);
})
module.exports = router;
