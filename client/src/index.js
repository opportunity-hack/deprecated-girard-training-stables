import React from 'react';
import { BrowserRouter, Route, Switch, useNavigate } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from "@auth0/auth0-react";
import { ThemeProvider, StyledEngineProvider, createTheme, adaptV4Theme } from '@mui/material/styles';
import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript

const theme = createTheme(adaptV4Theme({
  palette: {
    primary: {
      main: '#3700B3'
    },
    secondary: {
      main: '#03DAC5'
    }
  }
}));

const Auth0ProviderWithRedirectCallback = ({ children, ...props }) => {
    const navigate = useNavigate();
    const onRedirectCallback = (appState) => {
        navigate((appState && appState.returnTo) || window.location.pathname);
    };
    return (
        <Auth0Provider onRedirectCallback={onRedirectCallback} {...props}>
            {children}
        </Auth0Provider>
    );
}

root.render(
    <React.StrictMode>
      <BrowserRouter>
          <Auth0ProviderWithRedirectCallback
            domain={process.env.REACT_APP_AUTH0_DOMAIN}
            clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
            authorizationParams = {{
                redirect_uri: window.location.origin + "/signup",
                audience: "https://girard-server.herokuapp.com",
            }}
          >
               <StyledEngineProvider injectFirst>
                 <ThemeProvider theme={theme}>
                    <App />
                 </ThemeProvider>
               </StyledEngineProvider>
          </Auth0ProviderWithRedirectCallback>,
      </BrowserRouter>
    </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
