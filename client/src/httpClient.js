import axios from "axios"

const httpClient = axios.create();

// adds access tokens in all api requests. This is added when the auth0
// instance is ready and exports the getAccessTokenSilently method
export const addAccessTokenInterceptor = (getAccessTokenSilently) => {
    httpClient.interceptors.request.use(async (config) => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: `https://girard-server.herokuapp.com`
            },
        });
        config.headers.Authorization = `Bearer ${token}`;
        return config
    });
};

export default httpClient;
