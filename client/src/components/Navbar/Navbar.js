import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './Navbar.css';
import { Link } from 'react-router-dom';
import React from "react";
import Button from '@mui/material/Button'
import { useAuth0 } from "@auth0/auth0-react";

function AdminLink({ name, route, isAdmin }) {
    if (isAdmin) {
        return (
            <li>
                <Link to={route} style={{ textDecoration: 'none' }}>{name}</Link>
            </li>
        )
    }
    return
}

function Navbar() {
    const { logout, user, isAuthenticated, isLoading } = useAuth0();
    const isAdmin = user?.["https://girard-server.herokuapp.com/roles"]?.includes('admin');

        return  (
            isAuthenticated && 
            (
            <div className="navbar">
                <div className="content">
                    <span className="npo-heading">Girard Training Stables</span>
                    <span className="filler"></span>
                    <ul className="links">
                    <AdminLink name="Admin" route="/admin" isAdmin={isAdmin} />
                    <AdminLink name="Create Event" route="/create" isAdmin={isAdmin} />
                    <li>
                        <Link to="/volunteer" style={{ textDecoration: 'none' }}>Calendar</Link>
                    </li>
                    <li>
                        <Link to="/profile" style={{ textDecoration: 'none' }}>Profile</Link>
                    </li>
                    <li>
                        <Link onClick={() => logout({ returnTo: window.location.origin })} style={{ textDecoration: 'none' }}>Log Out</Link>
                    </li>
                    </ul>
                </div>
            </div>
        ));
    }

export default Navbar;
