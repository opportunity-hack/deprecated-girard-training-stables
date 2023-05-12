import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.js';
import Signup from './components/Signup/Signup.js';
import SlotPicker from './components/SlotPicker/SlotPicker';
import CreateEvent from './components/CreateEvent/CreateEvent';
import Login from './components/Login/Login';
import Profile from './components/Profile/Profile';
import { withAuthenticationRequired } from '@auth0/auth0-react';

sessionStorage.setItem("email",'');

const ProtectedRoute = ({ component, ...args }) => {
    const Component = withAuthenticationRequired(component, args);
    return <Component />;
}

const redirectMessage = () => <div>Redirecting you...</div>;

function App() {
  return (
    <div className="App">
      <main>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Login/>} exact />
          <Route path="/signup" element={<Signup />} />
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
  );
}

export default App;
