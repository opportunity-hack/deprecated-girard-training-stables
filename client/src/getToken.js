function getBearerToken() {
    var request = require("request");

    var options = { method: 'POST',
        url: process.env.REACT_APP_AUTH0_DOMAIN + '/oauth/token',
        headers: { 'content-type': 'application/json' },
        json: {
            "client_id": process.env.REACT_APP_AUTH0_CLIENT_ID,
            "client_secret": process.env.REACT_APP_AUTH0_CLIENT_SECRET,
            "audience": "https://girard-server.herokuapp.com/",
            "grant_type":"client_credentials"
        }
    };

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
