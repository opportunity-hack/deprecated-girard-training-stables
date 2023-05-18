
import './Signup.css';
import { styled } from '@mui/material/styles';
import Card from '../Card/Card.js';
import Button from '@mui/material/Button'
import React from 'react';
import PropTypes from 'prop-types';
import Input from '@mui/material/Input';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Error from '../Error/Error';
import { useNavigate } from 'react-router-dom';
import { Auth0Context, useAuth0 } from "@auth0/auth0-react";
import httpClient from "../../httpClient";
import { useState, useEffect } from 'react';

const PREFIX = 'Signup';

const classes = {
    root: `${PREFIX}-root`
};

const Root = styled('div')((
    {
        theme
    }
) => ({
    [`& .${classes.root}`]: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    }
}));


function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
      <Root
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={2}>
            {/* <Typography>{children}</Typography> */}
            {children}
          </Box>
        )}
      </Root>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

function Signup() {
    const { user, isAuthenticated, isLoading } = useAuth0();
    let navigate = useNavigate ();
    const [userID, setUserID] = useState("");
    const [value, setValue] = useState(0);
    const [formVal, setFormValue] = useState({
        firstname: '',
        lastname: '',
        phone: '',
        email: '',
        age: '',
        height: '',
        horseExperience: false,
        horseExpYrs: '',
        riding: false,
        tacking: false,
        grooming: false,
        leading: false
    });

    useEffect(() => {
        // We want to immediately create a user in the application DB
        // once they are redirected from the auth0 signup page, since they
        // may proceed into the application without submitting information
        // about themselves. 
        // If the user already exists, we redirect them to the calendar
        if (isAuthenticated && user.email && user.sub) {
            const existingUser = httpClient.get(
                process.env.REACT_APP_API_SERVER + "/me", 
                { params: {email: user.email}}
            ).then(res => {
                if (res.data.length === 0 || res.data === undefined) {
                const newUser = { user_id: user.sub, email: user.email}
                httpClient.post(
                    process.env.REACT_APP_API_SERVER + "/me",
                    newUser)
                    .then(res => setUserID[res.data._id])
                    .catch(err => console.error("Could not create new user:", err.data))
                } else {
                    navigate('/volunteer')
                }
            })
        }
    }, [isAuthenticated, user, navigate, setUserID])


    if (isLoading) {
        return <div>Loading ...</div>;
      }

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    }

    const handleChange = (event) => {
        let field = event.target.name;
        let value = ((event) => {
            switch(event.target.type) {
                case 'checkbox': 
                    return event.target.checked;
                default: 
                    return event.target.value;
            }
        })(event);

        setFormValue({
            ...formVal,
            [field]: value
        });
    }



    const handleSubmit = (event) => {
       event.preventDefault();
       if(isAuthenticated) 
       {
            var experienceUpdated;
            if(formVal.horseExpYrs === '')
                experienceUpdated = 0;
            else
                experienceUpdated = formVal.horseExpYrs;

            const submitForm = {
                "user_id": user.sub,
                "firstName": formVal.firstname,
                "lastName": formVal.lastname,
                "phoneNumber": formVal.phone,
                "email": user.email,
                "age": Number(formVal.age),
                "height": Number(formVal.height),
                "horseExperience": experienceUpdated,
                "horseRiding": formVal.riding,
                "horseTacking": formVal.tacking,
                "horseGrooming": formVal.grooming,
                "horseLeading": formVal.leading,
                "userType": 'volunteer'
            }
            
            console.log("submit form:", submitForm);
            console.log("User ID:", userID);

           httpClient.put(
               process.env.REACT_APP_API_SERVER + "/me",
               submitForm)
                .then(res => {
                    navigate("/volunteer");
                })
                .catch(err => console.log("error:",err.data))
        }
    }


    return (  isAuthenticated && (
        <div className="signup-form col-flex card">
            <div className="form-content col-flex flex-grow">
                <div className="heading">Tell us a bit about you</div>
                <div>This information will help in the process of matching you with opportunities to volunteer. You'll be able to change this later in your profile page.</div>
                <div className={classes.root}>
                        <Tabs value={value} onChange={handleTabChange} indicatorColor="primary" centered>
                            <Tab label="Basic Details" {...a11yProps(0)} />
                            <Tab label="Additional Information" {...a11yProps(1)} />
                        </Tabs>

                    <form onSubmit={handleSubmit} className="col-flex flex-grow">
                        <TabPanel value={value} index={0} className="panel">
                            <div>{`Email: ${user.email}`}</div>
                            <div className="name-field">
                                <div className="flex-grow" style={{width: '45%'}}>
                                    <Input className="input-field" type="text" name="firstname" value={formVal.firstname} onChange={handleChange} placeholder="First Name"/>
                                </div>
                                <div className="filler"></div>
                                <div className="flex-grow" style={{width: '45%'}}>
                                    <Input className="input-field" type="text" name="lastname" value={formVal.lastname} onChange={handleChange} placeholder="Last Name"/>
                                </div>
                            </div>
                            <div>
                                <Input className="input-field" type="tel" name="phone" value={formVal.phone} onChange={handleChange} placeholder="Phone Number"/>
                            </div>
                            <div>
                                <Input className="input-field" type="number" name="age" value={formVal.age} onChange={handleChange} placeholder="Age"/>
                            </div>
                            <div>
                                <Input className="input-field" type="number" name="height" value={formVal.height} onChange={handleChange} placeholder="Height in Inches"/>
                            </div>
                            <div className="filler"></div>
                            
                        </TabPanel>
                        <TabPanel value={value} index={1} className="panel">
                        <div className="skills-section">
                            <div className="skill">
                                <FormControlLabel
                                    control={<Checkbox name="horseExperience" checked={formVal.horseExperience} onChange={handleChange}/>}
                                    label="Do you have experience with horses?"
                                />
                                <Input className="input-field experience-field" type="number" name="horseExpYrs" value={formVal.horseExpYrs} disabled={ !formVal.horseExperience } onChange={handleChange} placeholder="How much (in years)?"/>
                            </div>
                            <div>
                                <FormControlLabel
                                control={<Checkbox name="riding" checked={formVal.riding} onChange={handleChange} disabled={!formVal.horseExperience} />}
                                label="Horse Riding"
                                />
                            </div>
                            <div>
                                <FormControlLabel
                                    control={<Checkbox name="tacking" checked={formVal.tacking} onChange={handleChange} disabled={!formVal.horseExperience} />}
                                    label="Horse Tacking"
                                />
                            </div>
                            <div>
                                <FormControlLabel
                                    control={<Checkbox name="grooming" checked={formVal.grooming} onChange={handleChange} disabled={!formVal.horseExperience} />}
                                    label="Horse Grooming"
                                />
                            </div>
                            <div>
                                <FormControlLabel
                                    control={<Checkbox name="leading" checked={formVal.leading} onChange={handleChange} disabled={!formVal.horseExperience} />}
                                    label="Horse Leading"
                                />
                            </div>
                            
                        </div>
                        </TabPanel>
                        <div className="filler"></div>
                        <div>
                            {value === 0 && <Button color="primary" variant="contained" onClick={()=>setValue(1)} className="button">Proceed to Skill Selection</Button>}
                        </div>
                        <div>
                            {value === 1 && <Button color="primary" variant="contained" type="submit" className="button">Submit</Button>}
                        </div>
                    </form>
                </div>
            </div>
        </div> )
    ); 
}

export default Signup;
