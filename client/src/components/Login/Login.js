
import './Login.css';
import Card from '../Card/Card.js';
import Button from '@mui/material/Button'
import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import Input from '@mui/material/Input';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Error from '../Error/Error';
import { useAuth0 } from "@auth0/auth0-react";


//Taken from Signup.js
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

function Login(props) {

    const { loginWithRedirect } = useAuth0();

    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [formVal, setFormValue] = React.useState({
        email: '',
        password: '',
    });

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    }


    //Value change script from signup used to update name and
    const handleChange = (event) => {
        let field = event.target.name;
        let value = event.target.value;

        setFormValue({
            ...formVal,
            [field]: value
        });
    }

    //Will need to be changed to talk to backend
    const handleSubmit = (event) => {
        // event.preventDefault();
        console.log('Logged In', formVal); //BACKEND
        //sessionStorage.setItem("email",formVal.email);
        //window.location.reload();
        //NEED TO VALIDATE
        //ROLE BASED ACCESS



        //<Button color="primary" variant="contained" onClick={handleSubmit} className="button">Log In</Button>
    }

    return (
        <>
            <br></br>
            <br></br>
            <br></br>
            <img src="https://static.wixstatic.com/media/d680c2_c1e3fe992b274533b001eb9c3f783368~mv2.png/v1/fill/w_272,h_192,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Screen%20Shot%202022-08-30%20at%201_02_49%20PM.png"></img>
            <div className="login-form col-flex card">
                <div className="form-content col-flex flex-grow">
                    <div className="heading">Log In To Access Lesson Scheduling</div>
                    <div className={classes.root}>
                        <form onSubmit={handleSubmit} className="col-flex flex-grow">
                            <div>
                                <Button color="primary" variant="contained" onClick={() => loginWithRedirect()} className="button" id="Log_In_Button">Log In/Register</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;