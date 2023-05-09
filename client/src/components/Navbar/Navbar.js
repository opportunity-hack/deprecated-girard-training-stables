import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './Navbar.css';
import { Link } from 'react-router-dom';
import React from "react";
import Button from '@mui/material/Button'
import { useAuth0 } from "@auth0/auth0-react";

function Navbar() {

    const { logout, user, isAuthenticated, isLoading } = useAuth0();

        return  (
            isAuthenticated && 
            (
            <div className="navbar">
                <div className="content">
                    <span className="npo-heading">Girard Training Stables</span>
                    <span className="filler"></span>
                    <ul className="links">
                    <li>
                        <Link to="/volunteer" style={{ textDecoration: 'none' }}>Calendar</Link>
                    </li>
                    <li>
                        <Link to="/profile" style={{ textDecoration: 'none' }}>Profile</Link>
                    </li>
                    <li>
                        <Link onClick={() => logout({ returnTo: "https://girard-client.herokuapp.com" })} style={{ textDecoration: 'none' }}>Log Out</Link>
                    </li>
                    </ul>
                </div>
            </div>
        ));
    }

export default Navbar;