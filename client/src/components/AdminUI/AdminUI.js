import React from "react";
import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Checkbox, Container, Typography, Button, List, ListItem, ListItemText, TextField } from '@mui/material';
import httpClient from '../../httpClient';

function AdminUI() {
  const { isAuthenticated, user, loginWithRedirect } = useAuth0();
  const isAdmin = user?.["https://girard-server.herokuapp.com/roles"]?.includes('admin');
  const [users, setUsers] = useState([]);
  useEffect(() => {
      if (isAuthenticated && isAdmin) {
          httpClient.get(process.env.REACT_APP_API_SERVER + "/users")
              .then(res => setUsers(res.data))
      }
  }, [isAuthenticated, isAdmin])
    if (!(isAuthenticated) || !(isAdmin)) {
        return (
          <Container sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h5" gutterBottom>
              You are not logged in.
            </Typography>
            <Button variant="contained" onClick={loginWithRedirect}>Log In</Button>
          </Container>
        );
    }

    return (
        <div>{ JSON.stringify(users) }</div>
    )
}

export default AdminUI;
