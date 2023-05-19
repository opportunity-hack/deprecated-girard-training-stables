import React from "react";
import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Checkbox, Container, Typography, Button, List, ListItem, ListItemText, TextField } from '@mui/material';
import httpClient from "../../httpClient";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Profile() {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
  const [isEditing, setIsEditing] = useState(false);
  // `profile` tracks the state of the values in the form, `DBProfile` represents the state  //  of the profile according to the database, in case an edit is cancelled, or the 
  // profile has to be reset to the initially loaded state for whatever other reason.
  const [profile, setProfile] = useState({
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    height: '',
    age: '',
    experience: '',
    skills: [],
  });
  const [DBProfile, setDBProfile] = useState({
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    height: '',
    age: '',
    experience: '',
    skills: [],
  });
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [requestError, setRequestError] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      httpClient.get(
          process.env.REACT_APP_API_SERVER + "/me",
          { params: {email: user.email}}
      ).then(res => {
          const userData = res.data[0];
          let skills = [
              { name: 'horse riding', has: userData.horseRiding ? true : false },
              { name: 'horse tacking', has: userData.horseTacking ? true : false },
              { name: 'horse grooming', has: userData.horseGrooming ? true : false },
              { name: 'horse leading', has: userData.horseLeading ? true : false }
          ]

          setProfile({
            _id: userData._id,
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: user.email,
            phoneNumber: user.phoneNumber || "",
            age: userData.age || "",
            height: userData.height || "",
            experience: userData.horseExperience,
            skills: skills,
          });
      })
    }
  }, [isAuthenticated, user, setProfile, setDBProfile]);

  const handleEditProfile = () => {
    setIsEditing(true);
    setDBProfile(profile)
  };

  const handleSaveProfile = () => {
    // Save profile changes
    setIsEditing(false);
    let userData = { user_id: user.sub };

    if (profile.firstName !== "") {
        userData.firstName = profile.firstName;
    }
    if (profile.lastName !== "") {
        userData.lastName = profile.lastName;
    }
    if (profile.phoneNumber !== "") {
        userData.phoneNumber = profile.phoneNumber;
    }
    if (profile.height !== "") {
        userData.height = profile.height;
    }
    if (profile.age !== "") {
        userData.age = profile.age;
    }
    userData.email = profile.email
    userData.experience = profile.experience;
    profile.skills.map(skill => {
        switch(skill.name) {
            case 'horse riding':
                userData.horseRiding = skill.has;
                break
            case 'horse tacking':
                userData.horseTacking = skill.has;
                break
            case 'horse grooming':
                userData.horseGrooming = skill.has;
                break
            case 'horse leading':
                userData.horseLeading = skill.has;
                break
        }
    })
    httpClient.put(
        process.env.REACT_APP_API_SERVER + "/me",
        userData)
          .then((res) => {
              setSnackBarOpen(true)
              setDBProfile(profile)
              setRequestError(false)
          }
          ).catch( (error) => {
              setSnackBarOpen(true)
              setRequestError(true)
              handleCancelEdit()
          })
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset profile state if needed
    setProfile(
        DBProfile
    );
  };

  const handleChange = (e) => {
    setProfile((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeSkill = (e) => {
    const newSkills = profile.skills.map((skill) => {
        if (skill.name == e.target.name) {
            skill.has = !skill.has
        }
        return skill
    })
    setProfile((prevState) => ({
      ...prevState,
      skills: newSkills,
    }));
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackBarOpen(false);
  };
  

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

  return (
    <Container sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Snackbar open={snackBarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} 
            severity={requestError ? "error" : "success"} sx={{ width: '100%' }}>
      {requestError ? "There was a problem saving changes." : "Successfully saved changes."}
        </Alert>
      </Snackbar>
      <div sx={{ marginBottom: 2 }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        {isEditing ? (
          <List dense>
            <ListItem sx={{ marginBottom: 1 }}>
              <TextField
                name="firstName"
                label="First name"
                value={profile.firstName}
                onChange={handleChange}
                fullWidth
              />
            </ListItem>
            <ListItem sx={{ marginBottom: 1 }}>
              <TextField
                name="lastName"
                label="last name"
                value={profile.lastName}
                onChange={handleChange}
                fullWidth
              />
            </ListItem>
            <ListItem sx={{ marginBottom: 1 }}>
              <TextField
                name="email"
                label="Email"
                value={profile.email}
                onChange={handleChange}
                fullWidth
              />
            </ListItem>
            <ListItem sx={{ marginBottom: 1 }}>
              <TextField
                name="phoneNumber"
                label="Phone Number"
                value={profile.phoneNumber}
                onChange={handleChange}
                fullWidth
              />
            </ListItem>
            <ListItem sx={{ marginBottom: 1 }}>
              <TextField
                name="height"
                label="Height (inches)"
                type="number"
                value={profile.height}
                onChange={handleChange}
                fullWidth
              />
            </ListItem>
            <ListItem sx={{ marginBottom: 1 }}>
              <TextField
                name="age"
                label="Age"
                type="number"
                value={profile.age}
                onChange={handleChange}
                fullWidth
              />
            </ListItem>
          </List>
        ) : (
          <List dense>
            <ListItem sx={{ marginBottom: 1 }}>
              <ListItemText primary={`First name: ${profile.firstName}`} />
            </ListItem>
            <ListItem sx={{ marginBottom: 1 }}>
              <ListItemText primary={`Last name: ${profile.lastName}`} />
            </ListItem>
            <ListItem sx={{ marginBottom: 1 }}>
              <ListItemText primary={`Email: ${profile.email}`} />
            </ListItem>
            <ListItem sx={{ marginBottom: 1 }}>
                <ListItemText primary={`Phone Number: ${profile.phoneNumber}`} />
            </ListItem>
            <ListItem sx={{ marginBottom: 1 }}>
                <ListItemText primary={`Height (inches): ${profile.height}`} />
            </ListItem>
            <ListItem sx={{ marginBottom: 1 }}>
                <ListItemText primary={`Age: ${profile.age}`} />
            </ListItem>
        </List>
        )}
</div>
        <div sx={{ marginBottom: 2 }}>
    <Typography variant="h4" gutterBottom>
      Skills
    </Typography>
    <List dense>
      {isEditing ? (
        <ListItem key="experience" sx={{ marginBottom: 1 }}>
          <TextField
            name="experience"
            label="Years of experience"
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            onChange={handleChange}
            value={profile.experience}
          />
        </ListItem>
      ) : (
        <ListItem key="experience" sx={{ marginBottom: 1 }}>
          <ListItemText primary={`Years of experience: ${profile.experience}`}/>
        </ListItem>
      )}
      {isEditing && <div>To add a skill, check the corresponding box</div>}
      {isEditing ? (
        profile.skills.map((skill, index) => (
        <ListItem key={index} sx={{ marginBottom: 1 }}>
          <Checkbox name={profile.skills[index].name} checked={profile.skills[index].has} onChange={handleChangeSkill}/>
          <ListItemText
            primary={`${skill.name}`}
          />
        </ListItem>
      ))) : 
      profile.skills.map((skill, index) => (
        skill.has &&
        <ListItem key={index} sx={{ marginBottom: 1 }}>
          <ListItemText
            primary={`${skill.name}`}
          />
        </ListItem>
      ))}
    </List>
  </div>

  {isEditing ? (
    <div>
      <Button sx={{ margin: 1 }} variant="contained" onClick={handleSaveProfile}>Save</Button>
      <Button sx={{ margin: 1 }} variant="outlined" onClick={handleCancelEdit}>Cancel</Button>
    </div>
  ) : (
    <div>
      <Button sx={{ margin: 1 }} variant="contained" onClick={handleEditProfile}>Edit Profile</Button>
      <Button sx={{ margin: 1 }} variant="outlined" onClick={() => logout({ returnTo: window.location.origin })}>Log Out</Button>
    </div>
  )}
</Container>);
}
export default Profile;
