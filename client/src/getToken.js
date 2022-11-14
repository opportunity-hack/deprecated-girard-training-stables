function getBearerToken() {
    var request = require("request");

    var options = { method: 'POST',
    url: 'https://dev-6ir-6qcd.us.auth0.com/oauth/token',
    headers: { 'content-type': 'application/json' },
    body: '{"client_id":"qXNclOWUOmztgoEzLyC4fGHZAjebCgXc","client_secret":"hTCxj3gVk7g2qZtQganaPOstD-Rxk9swukfPpHyDW9_tsXQFAEPZI-Ht2W83P1M4","audience":"https://girard-server.herokuapp.com/","grant_type":"client_credentials"}' };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        return body;
    });
}

function authenticate(url_extension) {
    const axios = require("axios");
    const bearerToken = getBearerToken();
    const url = "https://girard-server.herokuapp.com/" + url_extension;

    const options = { 
        method: "GET",
        url: url,
        headers: { "authorization": bearerToken },
    };

    axios(options)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            throw new Error(error);
        });
}