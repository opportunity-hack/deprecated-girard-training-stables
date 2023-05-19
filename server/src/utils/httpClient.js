const axios = require('axios');
const dotenv = require("dotenv")
dotenv.config()

const httpClient = axios.create();

function addAccessTokenInterceptor() {
    var options = { method: 'POST',
        url: 'https://' + process.env.AUTH0_DOMAIN + '/oauth/token',
        headers: { 'content-type': 'application/json' },
        data: {
            "client_id": process.env.AUTH0_CLIENT_ID,
            "client_secret": process.env.AUTH0_CLIENT_SECRET,
            "audience": 'https://' + process.env.AUTH0_DOMAIN + '/api/v2/',
            "grant_type":"client_credentials",
            "scopes": {
                "users": {
                    "actions": ["read", "update", "create", "delete"]
                }
            }
        }
    };

    axios(options).then((response) => {
        const token = response.data.access_token;
        httpClient.interceptors.request.use(async (config) => {
            config.headers.Authorization = `Bearer ${token}`;
            return config
        });
    }).catch((error) => {
        throw error
    });
}
 
module.exports = { httpClient, addAccessTokenInterceptor }
