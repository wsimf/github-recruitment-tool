const functions = require('firebase-functions');

const sendgrid = require('sendgrid')
const client = sendgrid("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")

function parseBody(body){
  var helper = sendgrid.mail;
  var fromEmail = new helper.Email(body.from);
  var toEmail = new helper.Email(body.to);
  var subject = body.subject;
  var content = new helper.Content('text/html',body.content);
  var mail = new helper.Mail(fromEmail,subject,toEmail,content);
  return mail.toJSON();
}

exports.sendEmailtoRecruiter = functions.https.onRequest((req, res) => {
  return Promise.resolve()
    .then(() => {
    if (req.method !== 'POST') {
  const error = new Error('Only POST requests are accepted');
  error.code = 405;
  throw error;
}
const request = client.emptyRequest({
  method: 'POST',
  path: '/v3/mail/send',
  body: parseBody(req.body)
});
return client.API(request)
})
.then((response) => {
  if (response.body) {
  res.send(response.body);
} else {
  res.end();
}
})
.catch((err) => {
  console.error(err);
return Promise.reject(err);
});
})
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
