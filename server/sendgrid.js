const express = require('express');
const sgMail = require('@sendgrid/mail');
const router = express.Router();

router.put('/sendEmail', (req, res) => {
  sgMail.setApiKey('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');
  const msg = {
    to: 'azho472@aucklanduni.ac.nz',
    from: 'nfuseuoa@gmail.com',
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };
  sgMail.send(msg);

})

module.exports = router;
