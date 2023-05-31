import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Container, Typography, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import httpClient from '../../httpClient';

function AdminUI() {
  const [isAdmin, setIsAdmin] = useState(false)
  const { isAuthenticated, user, loginWithRedirect } = useAuth0();
  const [users, setUsers] = useState([]);
  useEffect(() => {
        setIsAdmin(user?.["https://girard-server.herokuapp.com/roles"]?.includes('admin'));
  })
  useEffect(() => {
      httpClient.get(process.env.REACT_APP_API_SERVER + "/users")
          .then(res => setUsers(res.data))
  }, []);

    const columns = [
        {
          field: 'email',
          headerName: 'Email',
          editable: 'true',
          width: '190',
        },
        {
          field: 'phoneNumber',
          headerName: 'Phone ',
          editable: 'true',
          width: '190',
        },
        { field: 'firstName',
          headerName: 'First name',
          editable: true,
        },
        { field: 'lastName',
          headerName: 'Last name',
          editable: true,
        },
        {
            field: 'userType',
            headerName: 'user type',
            editable: true,
            type: 'singleSelect',
            valueOptions: ['volunteer', 'instructor', 'volunteer coordinator']
        },
        {
          field: 'isAdmin',
          headerName: 'Admin',
          editable: true,
          type: 'boolean',
        },
        {
          field: 'last_login',
          headerName: 'Last login',
          editable: false,
          width: '100',
          valueFormatter: (params) => {
              const date = new Date(params?.value)
              return date.toLocaleDateString("en-US")
          },
        },
        {
            field: 'height',
            headerName: 'height',
            type: 'number',
            editable: true,
            width: '100',
        },
        {
            field: 'age',
            headerName: 'age',
            type: 'number',
            editable: true,
            width: '100',
        },
        {
            field: 'horseExperience',
            headerName: 'Experience',
            type: 'number',
            editable: true,
            width: '150',
            valueFormatter: (params) => `${params?.value} years`,
        },
        {
          field: 'horseRiding',
          headerName: 'Riding',
          editable: true,
          type: 'boolean',
        },
        {
          field: 'horseTacking',
          headerName: 'Tacking',
          editable: true,
          type: 'boolean',
        },
        {
          field: 'horseGrooming',
          headerName: 'Grooming',
          editable: true,
          type: 'boolean',
        },
        {
          field: 'horseLeading',
          headerName: 'Leading',
          editable: true,
          type: 'boolean',
        },
    ]

    let rows = users;

    if (!isAuthenticated) {
        return (
          <Container sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h5" gutterBottom>
              You are not logged in.
            </Typography>
            <Button variant="contained" onClick={loginWithRedirect}>Log In</Button>
          </Container>
        );
    }

    if  (!isAdmin) {
        return (
          <Container sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h5" gutterBottom>
              You are not authorized to view this page.
            </Typography>
          </Container>
        );
    }

    return isAuthenticated && isAdmin && (
          <Container sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <DataGrid
                getRowId={(user) => user.user_id}
                rows={rows}
                columns={columns}
                checkboxSelection
                disableRowSelectionOnClick
            />
          </Container>
    )
}

export default AdminUI;
