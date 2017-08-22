$(document).ready(function() {
    console.log("Getting access code from Github");
    var code = getUrlParams(window.location.toString(), "code");

    if (code === undefined) {
        console.error("Unable to continue - Invalid code received");
        return;
    }

    var accessTokenRequest = $.ajax({
        url: "http://127.0.0.1:8080/requestGithubToken",
        method: "POST",
        accepts: "application/json",
        data: "code=" + code + "&userid=" + "TestUser",
        error: function(obj, errorText, errorCode) {
            console.log(errorText + errorCode + obj);
            $('#info').text(errorText);
        }
    });

    accessTokenRequest.done(function(reply) {
        $('#info').text("Done - Authentication data received");
    });
});

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