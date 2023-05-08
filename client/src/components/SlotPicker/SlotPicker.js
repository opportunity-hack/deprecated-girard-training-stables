import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import './SlotPicker.css';
import Card from '../Card/Card';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import SimpleModal from '../Modal/Modal';
import CustomAccordion from '../Accordion/Accordion';
import CreateEvent from '../CreateEvent/CreateEvent';
import InfoIcon from '@material-ui/icons/Info';
import { useAuth0 } from "@auth0/auth0-react";
import {
    Calendar,
    Views,
    DateLocalizer,
    momentLocalizer,
  } from 'react-big-calendar'
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import oldEvents from '../../mock/events';
import axios from 'axios';
import { useHistory } from 'react-router-dom';


function SlotPicker(props) {

    const { user, isAuthenticated, isLoading } = useAuth0();
    const [open, setOpen] = React.useState(false);
    const [Admin, setAdmin] = React.useState(false);
    const [body, setBody] = React.useState('');
    const [events, setEvents] = React.useState([]);

    //Array to display the day header
    const displaydays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    let history = useHistory();
    
    const handleClose = () => {
        setOpen(false);
    };

    const openModal = () => {
        setOpen(true);
    }

    const signUp = (data) => {
        console.log("Signing up for time slot:", data);
    }

    //Gets data from server
    let getData = async () => {
    
        axios.get('http://localhost:2222/lessons')
            .then(response => {
                console.log("response:", response);
                let newEvents = response.data;
                for (let i = 0; i < newEvents.length; i++) {
                    newEvents[i].start = new Date(newEvents[i].start);
                    newEvents[i].end = new Date(newEvents[i].end);
                }
                setEvents(newEvents);
            })
            .catch(error => {
                console.log("error:", error);
                setEvents(oldEvents);
            })
        
    };

    useEffect(() => {
        async function fetchData() {
            await getData();
        }
        fetchData();
        console.log("result:", events);
    }, []);

    // const handleCreateEvent = useCallback(
    //     () => {
    //         let temp = <CreateEvent data={events} submit={setEvents} handleClose={handleClose}/>

    //         setBody(temp);

    //         openModal();
    //     },
    //     [events]
    //   )
    const handleCreateEvent = () => {
        history.push('/create');
    }

    const handleSelectEvent = useCallback(
    (event) => {
        let temp = <CustomAccordion data={event} handleClose={handleClose} signUp={signUp} />

        setBody(temp);

        openModal();
    },
    []
  )

    if (isLoading) {
        return <div>Loading ...</div>;
      }

    if(isAuthenticated)
    {
        var safeEmail = user.email;
     }
     else
     {
        var safeEmail = "BAD@gmail.com"
     }
     //Check if a user with the email exists
     console.log('Email checked: ', safeEmail);
    axios.get('http://localhost:2222/users', { params: { email: safeEmail } } )
     .then(res => {
        console.log('User Returned:',res.data);
        console.log('User Type:',res.data.userType);
        if (res.data.userType == 'volunteer coordinator')
        {
            setAdmin(true);
        }
     })
     .catch(err => console.log("Error-AdminCheck: ", err.data));


   

    //Shows the legend when the info button is clicked
    const showInfo = () => {
        let temp = <div style={{padding: '20vh 30%'}}>
            <h2 style={{paddingLeft: '40px'}}>Legend</h2>
            <ul style={{textDecoration: 'none'}}>
                <li className="flex"><div className="square purple"></div> You're registered for at least one time slot on this day</li>
                <li className="flex"><div className="square white"></div> There are open slots available to volunteer on this day</li>
                <li className="flex"><div className="square gray"></div> There are no slots available on this day</li>
            </ul>
        </div>;
        setBody(temp);
        openModal();
    }

   




    const localizer = momentLocalizer(moment)

    
    let content = (
        <div className="calendar-container">
            <div className="flex">
                <div className="volunteer-heading">Choose a slot to Volunteer</div>
                {}
            </div>
            <Card style={{minHeight: 'fit-content', padding: '1%'}}>
            <div className="grid">
                { displaydays.map((day, dayIndex) => <div key={dayIndex} style={{fontWeight: 'bold'}}>{day}</div> ) }
            </div>
            <div>
                <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={handleSelectEvent}
                style={{ height: 800 }}
                />
            </div>

            {Admin && <AddCircleIcon style={{fontSize:"3.5rem"}} color="secondary" onClick={handleCreateEvent} className="create-event"/>}
            <InfoIcon style={{fontSize:"3.5rem"}} color="secondary" onClick={showInfo} className="show-info"/>

            <div className="event">
                <SimpleModal open={open} body={body} handleClose={handleClose} />
            </div>
            </Card>
        </div>
    );

    return content;
}

export default SlotPicker;