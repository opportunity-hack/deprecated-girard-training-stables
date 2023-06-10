import './App.css';
import { useEffect } from "react";
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.js';
import Signup from './components/Signup/Signup.js';
import SlotPicker from './components/SlotPicker/SlotPicker';
import CreateEvent from './components/CreateEvent/CreateEvent';
import Login from './components/Login/Login';
import Profile from './components/Profile/Profile';
import AdminUI from './components/AdminUI/AdminUI';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import { addAccessTokenInterceptor } from './httpClient';
import { useAuth0 } from '@auth0/auth0-react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

sessionStorage.setItem("email",'');

const ProtectedRoute = ({ component, ...args }) => {
    const Component = withAuthenticationRequired(component, args);
    return <Component />;
}

const redirectMessage = () => <div>Redirecting you...</div>;


function App() {
  const { getAccessTokenSilently } = useAuth0();
  useEffect(() => {
    addAccessTokenInterceptor(getAccessTokenSilently);
  }, [getAccessTokenSilently]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <div className="App">
      <main>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Login/>} exact />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/admin"
            element={<ProtectedRoute 
                    component={AdminUI}
                    onRedirecting={redirectMessage} />} />
          <Route 
            path="/volunteer"
            element={<ProtectedRoute 
                    component={SlotPicker}
                    onRedirecting={redirectMessage} />} />
          <Route 
            path="/create"
            element={<ProtectedRoute 
                    component={CreateEvent} 
                    onRedirecting={redirectMessage} />} />
          <Route 
            path="/profile"
            element={<ProtectedRoute 
                    component={Profile}
                    onRedirecting={redirectMessage} />} />
        </Routes>
      </main>
    </div>
    </LocalizationProvider>
  );
}

export default App;
