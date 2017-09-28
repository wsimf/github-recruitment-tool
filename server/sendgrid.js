const express = require('express');
const sgMail = require('@sendgrid/mail');
const router = express.Router();

router.put('/sendReviewerEmail', (req, res) => {
  sgMail.setApiKey('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');
  // console.log(req.body.reviewer);
  const msg = {
    to: req.body.reviewer.email,
    from: 'nfuseuoa@gmail.com',
    subject: 'You have been assigned a new Candidate to review!',
    text: 'You will receive an invitation to a GitHub repository with the candidates solution. Fill in comments here: '
  };
  sgMail.send(msg);

})

router.put('/sendCandidateEmail', (req, res) => {
  sgMail.setApiKey('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');
  const msg = {
    to: req.body.candidate.email,
    from: 'nfuseuoa@gmail.com',
    subject: 'MYOB Technical Assessment',
    text: 'You have been invited to do a challenge to assess your technical capabilities.' +
    'You will recieve an invitation to a GitHub repository which will contain further instructions'
  };
  sgMail.send(msg);
})

module.exports = router;
