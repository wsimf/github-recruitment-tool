$(document).ready(function () {
  console.log("Getting access code from Github");
  var code = getUrlParams(window.location.toString(), "code");
  console.log("code is: " + code);

  if (code === undefined) {
    console.error("Unable to continue - Invalid code received");
    return;
  }

  var accessTokenRequest = $.ajax({
    url: "http://127.0.0.1:8080/requestGithubToken",
    method: "POST",
    accepts: "application/json",
    data: "code=" + code + "&userid=" + "TestUser",
    error: function (obj, errorText, errorCode) {
      console.log(errorText + errorCode + obj);
      $('#info').text(errorText);
    }
  });

  accessTokenRequest.done(function (reply) {
    $('#info').text("Done - Authentication data received");
  });
});

function createRepo() {
  var collaborator = document.getElementsByName("collaborator")[0].value;
  console.log(collaborator);

  var code = getUrlParams(window.location.toString(), "code");
  var accessTokenRequest = $.ajax({
    url: "http://127.0.0.1:8080/createRepository",
    method: "POST",
    accepts: "application/json",
    data: "code=" + code + "&collaborator=" + collaborator,
    error: function (obj, errorText, errorCode) {
      console.log(errorText + errorCode + obj);
      $('#repo').text(errorText);
    }
  });
  console.log("Repo request started.");


  accessTokenRequest.done(function (reply) {
    var importRequest = $.ajax({
      url: "http://127.0.0.1:8080/importRepository",
      method: "PUT",
      accepts: "application/json",
      data: "code=" + code + "&collaborator=" + collaborator,
      error: function (obj, errorText, errorCode) {
        console.log(errorText + errorCode + obj);
        $('#repo').text(errorText);
      }
    });
    console.log("Importing content into repo");
    importRequest.done(function (reply) {
      $('#repo').text("Done - Repo created!");

    }).done(function (reply) {
      // After import is done, add collaborators (only 1 request can be executed at a time)
      var addCollaboratorRequest = $.ajax({
        url: "http://127.0.0.1:8080/addCollaborator",
        method: "PUT",
        accepts: "application/json",
        data: "code=" + code + "&collaborator=" + collaborator,
        error: function (obj, errorText, errorCode) {
          console.log(errorText + errorCode + obj);
          $('#repo').text(errorText);
        }
      });
      console.log("Adding candidate into repo");
      addCollaboratorRequest.done(function (reply) {
        $('#repo').text("Done - Candidate added!");
      });
    });

  });

}

function getUrlParams(url, requiredParam) {
  if (url === undefined) {
    console.error("URL required");
    return;
  }

  var params = url.split("?");
  if (params.length < 1) {
    console.error("Invalid URL " + url);
    return;
  }

  //Omit the first value which is the path
  var individualParams = params[1].split("&");
  var decodedParams = {};
  for (var i = 0; i < individualParams.length; i++) {
    var paramPair = individualParams[i].split("=");
    if (paramPair.length == 2) {
      decodedParams[paramPair[0]] = paramPair[1];
    } else {
      console.error("Invalid params " + paramPair);
    }
  }

  if (requiredParam === undefined) {
    return decodedParams; //return all values
  } else {
    return decodedParams[requiredParam];
  }
}
