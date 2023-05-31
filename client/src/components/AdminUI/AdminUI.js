import { useCallback, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Container, Typography, Button, Snackbar, Alert } from '@mui/material';
import { GridRowModes, GridActionsCellItem, DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import httpClient from '../../httpClient';

const useUpdateUsers = () => {
    return useCallback(
        (user) =>
          new Promise((resolve, reject) => {
            setTimeout(async () => {
                const res = await httpClient.patch(`${process.env.REACT_APP_API_SERVER}/users/${user._id}`, user).catch(err => "")
                if (res.status != 200) {
                    reject(new Error("Error updating user."));
                } else {
                    resolve(user);
                }
            }, 200);
        }),
      [],
    );
}

function AdminUI() {
  const [isAdmin, setIsAdmin] = useState(false)
  const { isAuthenticated, user, loginWithRedirect } = useAuth0();
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [snackbar, setSnackbar] = useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const updateUsers = useUpdateUsers();
  useEffect(() => {
        setIsAdmin(user?.["https://girard-server.herokuapp.com/roles"]?.includes('admin'));
  })
  useEffect(() => {
      httpClient.get(process.env.REACT_APP_API_SERVER + "/users")
          .then(res => setRows(res.data))
  }, []);

    const handleRowEditStart = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const handleRowEditStop = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (_id) => async() => {
        try {
        await httpClient.delete(`${process.env.REACT_APP_API_SERVER}/users/${_id}`).catch(err => "")
        setRows(rows.filter((row) => row._id !== _id));
            setSnackbar({ children: 'User successfully deleted', severity: 'success' });
        } catch (err) {
          setSnackbar({ children: 'Error deleting user', severity: 'error' });
        }
    };

    const handleCancelClick = (_id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [_id]: { mode: GridRowModes.View, ignoreModifications: true},
        });

        const editedRow = rows.find((row) => row._id === _id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row._id !== _id));
        }
    };

    const processRowUpdate = async (newRow) => {
        await updateUsers(newRow);
        const updatedRow = { ...newRow, isNew: false };
        setSnackbar({ children: 'User successfully saved', severity: 'success' });
        return updatedRow;
    }

    const handleProcessRowUpdateError = useCallback((error) => {
      setSnackbar({ children: error.message, severity: 'error' });
    }, []);

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

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
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
              const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
  
              if (isInEditMode) {
                return [
                  <GridActionsCellItem
                    icon={<SaveIcon />}
                    label="Save"
                    onClick={handleSaveClick(id)}
                  />,
                  <GridActionsCellItem
                    icon={<CancelIcon />}
                    label="Cancel"
                    className="textPrimary"
                    onClick={handleCancelClick(id)}
                    color="inherit"
                  />,
                ];
              }

            return [
              <GridActionsCellItem
                icon={<EditIcon />}
                label="Edit"
                className="textPrimary"
                onClick={handleEditClick(id)}
                color="inherit"
              />,
              <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Delete"
                onClick={handleDeleteClick(id)}
                color="inherit"
              />,
            ];
          },
        }
    ]

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
          <Container maxWidth='false' sx={{ width: '100%', overflowX: 'auto', marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <DataGrid
                getRowId={(user) => user._id}
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStart={handleRowEditStart}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={handleProcessRowUpdateError}
            />
            {!!snackbar && (
                <Snackbar
                  open
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                  onClose={handleCloseSnackbar}
                  autoHideDuration={6000}
                >
                    <Alert {...snackbar} onClose={handleCloseSnackbar} />
                </Snackbar>
            )}
          </Container>
    )
}

export default AdminUI;
