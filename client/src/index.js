import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
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

root.render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
    redirectUri={window.location.origin + "/signup"}
  >
    <React.StrictMode>
      <BrowserRouter>
       <StyledEngineProvider injectFirst>
         <ThemeProvider theme={theme}>
            <App />
         </ThemeProvider>
       </StyledEngineProvider>
      </BrowserRouter>
    </React.StrictMode>,
  </Auth0Provider>,
  document.getElementById("root")
);

/* ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
); */

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
