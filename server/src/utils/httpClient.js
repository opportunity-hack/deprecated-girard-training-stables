import axios from 'axios';

const httpClient = axios.create();

function getBearerToken() {
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
        return response.data
    }).catch((error) => {
        throw new Error(error);
    });
}
 
// adds access tokens to all httpClient requests. The returned Access Token will expire 
// within a short period, so a new token needs to be retrieved periodically to simulate a 
// non-expiring token.
export const addAccessTokenInterceptor = () => {
    httpClient.interceptors.request.use(async (config) => {
        const token = getBearerToken();
        config.headers.Authorization = `Bearer ${token}`;
        return config
    });
};

export default httpClient;
