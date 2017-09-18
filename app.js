"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();

var authToken;
app.use(express.static('public')); //Publish the files in the public folder so that user can access them on the browser

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/requestGithubToken', function(req, res) {
    console.log("Received new request to get OAuth token for user " + req.body.userid);

    //Send the HTTP request to Github
    const data = JSON.stringify({
        client_id: 'b8e1d295bb54ac91ab15',
        client_secret: '89229bc9e9c3563f49e5b013f45852ecb0d6f509', //This is very important! Guard it with your life lol :P
        code: req.body.code
    });

    const httpsOptions = {
        hostname: 'github.com',
        path: '/login/oauth/access_token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
            'Accept': 'application/json',
        },
    };

    const externalRequest = https.request(httpsOptions, function(githubResponse) {
        githubResponse.on('data', function(data) {
            const jsonData = JSON.parse(data);
            if (jsonData['error'] === undefined) { //Successful
                res.status(200);

                //TODO send the access_token and userid to a database
                authToken = jsonData.access_token;
                console.log(jsonData);

                res.json({
                    'success': 'User ' + req.body.userid + " is now successfully authenticated"
                });
            } else { //Not successfull - communicate to the user
                res.status(401);
                res.json(jsonData);
            }
        });
    });

    externalRequest.on('error', function(error) {
        console.log("Error while requesting Github token for user " + req.body.userid);
        res.status(401); //Inform it to the user - unauthorized
        res.json({
            'error': 'Unable to send the Github request'
        });
    });

    externalRequest.write(data);
    externalRequest.end();
});

app.post('/createRepository', function (req, res) {
    var collaborator = req.body.collaborator;

    //Send the HTTP request to Github
    const data = JSON.stringify({
        client_id: 'b8e1d295bb54ac91ab15',
        client_secret: '89229bc9e9c3563f49e5b013f45852ecb0d6f509', //This is very important! Guard it with your life lol :P
        code: req.body.code,
        access_token: authToken,
        name: 'code-challenge-' + collaborator,
        description: 'This is your first repository',
        homepage: 'https://github.com',
        private: false,   //False for now since we dont have any private repos for the general acc
        has_issues: true,
        has_projects: true,
        has_wiki: true
    });

    const httpsOptions = {
        hostname: 'api.github.com',
        //for creating
        path: '/user/repos',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token ' + authToken,
            'User-Agent': 'github-recruitment-tool',
            'Content-Length': data.length,
            'Accept': 'application/json',
        },
    };

    const externalRequest = https.request(httpsOptions, function(githubResponse) {
        let chunks = [];
        githubResponse.on('data', function(data) {
            chunks.push(data);
        }).on('end', function(){
            let data = Buffer.concat(chunks);
            const jsonData = JSON.parse(data);
            if (jsonData['error'] === undefined) { //Successful
                res.status(200);

                console.log(jsonData);

                res.json({
                    'success': 'Repo ' + data.name + " has been created successfully"
                });
            } else { //Not successfull - communicate to the user
                res.status(401);
                res.json(jsonData);
            }
        });
    });

    externalRequest.on('error', function(error) {
        console.log("Error while creating repo");
        res.status(401); //Inform it to the user - unauthorized
        res.json({
            'error': 'Unable to send the Github request'
        });
    });

    externalRequest.write(data);
    externalRequest.end();

});


app.put('/importRepository', function (req, res) {
    var collaborator = req.body.collaborator;

    //Send the HTTP request to Github
    const data = JSON.stringify({
        client_id: 'b8e1d295bb54ac91ab15',
        client_secret: '89229bc9e9c3563f49e5b013f45852ecb0d6f509', //This is very important! Guard it with your life lol :P
        code: req.body.code,
        access_token: authToken,
        vcs: "git",
        vcs_url: "https://github.com/nfuseuoa/Origin-Technical-Challenge.git"
    });

    const httpsOptions = {
        hostname: 'api.github.com',
        //for creating
        path: '/repos/nfuseuoa/code-challenge-' + collaborator + '/import',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token ' + authToken,
            'User-Agent': 'github-recruitment-tool',
            'Content-Length': data.length,
            'Accept': 'application/vnd.github.barred-rock-preview',   //Need this particular media type
        },
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
                    'success': 'Repo ' + data.html_url + " is been imported"
                });
            } else { //Not successfull - communicate to the user
                res.status(401);
                res.json(jsonData);
            }
        });
    });

    externalRequest.on('error', function(error) {
        console.log("Error while importing repo");
        res.status(401); //Inform it to the user - unauthorized
        res.json({
            'error': 'Unable to send the Github request'
        });
    });

    externalRequest.write(data);
    externalRequest.end();
});

app.put('/addCollaborator', function (req, res) {
  var collaborator = req.body.collaborator;
  console.log("COLLABORATOR:" + collaborator);

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
});





app.listen(80);
