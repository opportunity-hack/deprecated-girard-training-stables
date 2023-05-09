import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.js';
import Signup from './components/Signup/Signup.js';
import SlotPicker from './components/SlotPicker/SlotPicker';
import CreateEvent from './components/CreateEvent/CreateEvent';
import Login from './components/Login/Login';
import Profile from './components/Profile/Profile'

sessionStorage.setItem("email",'');

function App() {
  return (
    <div className="App">
      <main>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Login/>} exact />
          <Route path="/signup" element={<Signup />} />
          <Route path="/volunteer" element={<SlotPicker />} />
          <Route path="/create" element={<CreateEvent />} />
          <Route path="/profile" element={<Profile/>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
