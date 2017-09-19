const express = require('express');
const router = express.Router();

router.put('/addCollaborator', (req, res) => {
  var collaborator = req.body.collaborator;
  if (collaborator === undefined) {
    console.error("No collaborator specified")
  }

  //Send the HTTP request to Github
  const data = JSON.stringify({
    client_id: 'b8e1d295bb54ac91ab15',
    client_secret: '89229bc9e9c3563f49e5b013f45852ecb0d6f509', //This is very important! Guard it with your life lol :P
    code: req.body.code,
    access_token: authToken
  });

  const httpsOptions = {
    hostname: 'api.github.com',
    //for creating
    path: '/repos/nfuseuoa/code-challenge-' + collaborator + '/collaborators/' + collaborator,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'token ' + authToken,
      'User-Agent': 'github-recruitment-tool',
      'Accept': 'application/vnd.github.hellcat-preview+json'   //Need this particular media type
    }
  };

  const externalRequest = https.request(httpsOptions, function(githubResponse) {
    let chunks = [];
    githubResponse.on('data', function(data) {
      chunks.push(data);
    }).on('end', function() {
      let data = Buffer.concat(chunks);
      const jsonData = JSON.parse(data);
      if (jsonData['error'] === undefined) { //Successful
        res.status(200);

        console.log(jsonData);

        res.json({
          'success': 'Collaborator ' + collaborator + " has been added to the repository"
        });
      } else { //Not successfull - communicate to the user
        res.status(401);
        res.json(jsonData);
      }
    });
  });

  externalRequest.on('error', function(error) {
    console.log("Error while adding candidate");
    res.status(401); //Inform it to the user - unauthorized
    res.json({
      'error': 'Unable to send the Github request'
    });
  });

  externalRequest.write(data);
  externalRequest.end();
})

module.exports = router;
