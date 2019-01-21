const express = require('express');
const sgMail = require('@sendgrid/mail');
const router = express.Router();
// const typescriptRequire = require('typescript-require');
// var addCandComponent = require('../src/app/components/add-cand.component.ts');

router.put('/sendDevManagerEmail', (req, res) => {
  console.log("Sending email to dev manager: " + req.body.email);
  sgMail.setApiKey('<>');
  // console.log(req.body.reviewer);
  const msg = {
    to: req.body.email,
    from: 'nfuseuoa@gmail.com',
    subject: 'A candidate is ready to be reviewed!',
    text: req.body.content
  };

  sgMail.send(msg);

})

router.put('/sendCandidateEmail', (req, res) => {
  console.log("Sending email to candidate: " + req.body.candidate.name);
  sgMail.setApiKey('<>');
  const msg = {
    to: req.body.candidate.email,
    from: 'nfuseuoa@gmail.com',
    subject: 'MYOB Technical Assessment',
    text: 'You have been invited to do a challenge to assess your technical capabilities.' +
    'You will receive an invitation to a GitHub repository which will contain further instructions'
  };
  sgMail.send(msg);

})

router.put('/sendRecruiterEmail', (req, res) => {
  console.log("Sending email to recruiter: " + req.body.recruiterEmail);
  sgMail.setApiKey('<>');
  // console.log(req.body.recruiter);
  const msg = {
    to: req.body.recruiterEmail,
    from: 'nfuseuoa@gmail.com',
    subject: 'A review has been completed for ' + req.body.candidate.name,
    text: req.body.feedback.reviewerGithub + ' has completed a review for ' + req.body.candidate.name + '\n\n' +
      'Summary: ' + req.body.feedback.summary + '\n\n' +
      'Skill Level: ' + req.body.feedback.recommend
  };
  sgMail.send(msg);
})
module.exports = router;
