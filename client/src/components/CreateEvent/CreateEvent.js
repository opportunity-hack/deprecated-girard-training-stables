import DatePicker from '../Datepicker/Datepicker';
import { styled } from '@mui/material/styles';
import {getBearerToken, authenticate} from "../../getToken"

import React, { useState, useEffect } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Card from '../Card/Card';
import Timepicker from '../Timepicker/Timepicker';
import axios from 'axios';
import moment from 'moment';

const PREFIX = 'CreateEvent';

const classes = {
    formControl: `${PREFIX}-formControl`
};

const StyledCard = styled(Card)((
    {
        theme
    }
) => ({
    [`& .${classes.formControl}`]: {
        margin: theme.spacing(1),
        minWidth: '10rem',
        height: '4rem'
    }
}));

export default function CreateEvent(props) {
    const [formVal, setFormValue] = useState({
        startDate: '',
        endDate: '',
        recurring: false,
        interval: '',
        start: '',
        end: '',
        startTime: '',
        //startTimeMinute: '',
        endTime: '',
        //endTimeMinute: '',
        positions: [],
        lessonAssistantReq: false,
        horseLeaderReq: false,
        barnCrewReq: false,
        pastureCrewReq: false,
        sidewalkerReq: false,
        lessonAssistantCount: '',
        horseLeaderCount: '',
        barnCrewCount: '',
        pastureCrewCount: '',
        sidewalkerCount: '',
        instructor: '',
        title:''
    });

    const [instructors, setInstructors] = useState({});
    const [instructorsArr, setInstructorsArr] = useState([]);

    const intervals = ['Every day', 'Two Days', 'Three Days', 'Four Days', 'Five Days', 'Six Days', 'Weekly'];

    useEffect(() => {
        //call user api to get users
        /*
        allUsers = authenticate('users');
        //allUsers = res.data;
        console.log("RESULT: ", allUsers);
        var allUsers = allUsers.filter(user => user.userType == "volunteer");
        var map = new Map(allUsers.map(obj => {
            return [obj.firstName, obj];
        }));
        console.log("map: ", map);
        setInstructors(map);
        setInstructorsArr(Array.from(map.keys()));
	*/
        axios.get('http://localhost:2222/users')
        .then(res => {
            console.log('users recieved');
            allUsers = res.data;
            console.log("RESULT: ", res.data);
            var allUsers = res.data.filter(user => user.userType === "volunteer");
            var map = new Map(res.data.map(obj => {
                return [obj.firstName, obj];
            }));
            console.log("map: ", map);
            setInstructors(map);
            setInstructorsArr(Array.from(map.keys()));
        })
        .catch(err => console.log(err.data));
        

        //console.log("All Users: ", allUsers);

        //setInstructors(allUsers.filter(user => user.userType == "volunteer"));
      }, []);

    const createNewEvent = () => {

    };

    const handleChange = (event) => {
        console.log(event);
        let field = event.target.name || event.target.id; // Get which part was changed
        let value = ((event) => { // Value = event = what is returned by the function?
            switch (event.target.type) { // Returns whether the checkbox is checked or not if the field that called handleChange was a checkbox
                case 'checkbox':
                    return event.target.checked;
                default:
                    return event.target.value; // Returns the value of the field otherwise
            }
        })(event);

        setFormValue({ // Set the value of the form field to the value of the field that called handleChange
            ...formVal,
            [field]: value
        });
    }

    const submitEventRequest = (e) => {
        e.preventDefault()
        console.log('Event submit')
        console.log('form: ', formVal.instructor);
        console.log('form inst: ', instructors.get(instructorsArr[formVal.instructor]));
        let fD = {};    // The event that we will submit - starts empty
        // let startDate = new Date(formVal.startDate);
        // let endDate = new Date(formVal.endDate);
        fD.instructor = instructors.get(instructorsArr[formVal.instructor]);
        fD.volunteers = { // Initialize all the values that we will get from the user as empty to begin.
            "barn crew": {
                minVolunteers: formVal.barnCrewCount || 0,
                signedUp: []
            },
            "pasture crew": {
                minVolunteers: formVal.pastureCrewCount || 0,
                signedUp: []
            },
            "lesson assistant": {
                minVolunteers: formVal.lessonAssistantCount || 0,
                signedUp: []
            },
            "sidewalker": {
                minVolunteers: formVal.sidewalkerCount || 0,
                signedUp: []
            },
            "horse leader": {
                minVolunteers: formVal.horseLeaderCount || 0,
                signedUp: []
            }
        };
        fD.horses = [];
        fD.notes = '';
        // fD.title = formVal.title;
        // fD.bookedDates = [];

        // fD.bookedDates.push(new Date(formVal.startDate));

        // Date.prototype.addDays = function (days) {
        //     var date = new Date(this.valueOf());
        //     date.setDate(date.getDate() + days);
        //     return date;
        // }

        // let date1 = new Date(formVal.startDate);
        // if (formVal.recurring) { // Calculate the difference between date1 and date2 - determine start and end date?
        //     let date2 = new Date(formVal.endDate);
        //     let interval = formVal.interval + 1;
        //     const diffTime = Math.abs(date2 - date1);
        //     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        //     let temp;
        //     for (let i = interval; i <= diffDays; i += interval) {
        //         temp = date1.addDays(i);
        //         fD.bookedDates.push(temp);
        //     }
        // }

        // fD.startTime = formVal.startTime;
        // fD.endTime = formVal.endTime;
        // fD.notes = "";

        // console.log('Form Data', fD); // Store the event data we got
        // fetch('http://localhost:2222/lessons/', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(fD),
        // })
        // .then((response) => response.json())
        // .then((fD) => {
        //     console.log('Success:', fD);
        // })
        // .catch((error) => {
        //     console.error('Error: error');
        // });
        //let start = formVal.startDate + formVal.startTime;
        //let end = formVal.endData + formVal.endTime;
        // new Date(year, monthIndex, day, hours, minutes)
        // let startYear = formVal.startDate.substring(0,4);
        // let startMonth = parseInt(formVal.startDate.substring(5,7)) - 1;
        // let startDay = formVal.startDate.substring(8);
        // let startHour = formVal.startTime.substring(0,2);
        // let startMinute = formVal.startTime.substring(3);

        // let startDate = new Date(startYear, startMonth, startDay, startHour, startMinute);

        // let endYear = formVal.endDate.substring(0,4);
        // let endMonth = parseInt(formVal.endDate.substring(5,7)) - 1;
        // let endDay = formVal.endDate.substring(8);
        // let endHour = formVal.endTime.substring(0,2);
        // let endMinute = formVal.endTime.substring(3);

        // let endDate = new Date(endYear, endMonth, endDay, endHour, endMinute);

        let start = moment(formVal.startDate + formVal.startTime, 'YYYY-MM-DDhh:mm').toDate();
        let end = moment(formVal.endDate + formVal.endTime, 'YYYY-MM-DDhh:mm').toDate();
        // console.log("startD:", formVal.startDate);
        // console.log("endD:", formVal.endDate);
        // console.log("startT:", formVal.startTime);
        // console.log("endT:", formVal.endTime);

        // let startD = new Date(formVal.startDate);
        // let endD = new Date(formVal.endDate);

        // startD.setHours(formVal.startTime.substring(0,2));
        // startD.setMinutes(formVal.startTime.substring(3,));
        // endD.setHours(endT.getHours);
        // endD.setMinutes(endT.getMinutes);

        // console.log("startD:",startD);
        // console.log("endD:",endD);

        // let start = startD+startT;
        // let end = endD+endT;
        // let start = Date.parse(formVal.startDate + formVal.startTime);
        // let end = Date.parse(formVal.endDate + formVal.endTime);

        const form = {
            start: start,
            end: end,
            instructor: fD.instructor,
            volunteers: fD.volunteers,
            horses: null,
            notes: '',
            title: formVal.title
        }

        console.log(form)

        axios.post('http://localhost:2222/lessons', form)
            .then(res => {
                console.log('Lesson created', res);
                let events = JSON.parse(JSON.stringify(props.data));
                res.data.start = new Date(res.data.start);
                res.data.end = new Date(res.data.end);
                events.push(res.data);
                props.submit(events);
            })
            .catch(err => console.log(err.data));
        props.handleClose();
    }





    return (
        // Get all the data that we need from the user
        <StyledCard style={{ width: '50%', padding: '2% 3%', margin: 'auto', justifyContent: 'center' }} className="flex flex-grow">
            <CloseIcon style={{float: 'right', fontSize: '2rem', cursor: 'pointer'}} onClick={props.handleClose} />
            <header className="heading modal-heading">Create New Event</header>
            <form className="event-form" onSubmit={submitEventRequest}>
                <div className="flex flex-grow" style={{justifyContent: 'space-between'}}>
                    <Input style={{ width: '100%', margin: "20px" }} name="title" onChange={handleChange} value={formVal.title} type="text" placeholder="Title" />
                </div>
                <div className="flex flex-grow" style={{ justifyContent: 'space-between' }}>
                    <DatePicker id="startDate" name="startDate" label="Start Date" handleDate={handleChange} value={formVal.startDate} />
                    <DatePicker id="endDate" name="endDate" label="End Date" disabled={!formVal.recurring} handleDate={handleChange} value={formVal.endDate} />
                </div>
                <div className="flex flex-grow" style={{ justifyContent: 'space-between' }}>
                    <FormControlLabel
                        control={<Checkbox id="recurring" name="recurring" checked={formVal.recurring} onChange={handleChange} />}
                        label="Recurring Event"
                    />
                    <FormControl className={classes.formControl}>
                        <InputLabel id="select-interval">Select Interval</InputLabel>
                        <Select labelId="interval" id="interval" name="interval" value={formVal.interval} disabled={!formVal.recurring} onChange={handleChange} >
                            {intervals.map((day, ind) => <MenuItem key={ind} value={ind}>{day}</MenuItem>)}
                        </Select>
                    </FormControl>
                </div>
                <div className="flex flex-grow" style={{ justifyContent: 'space-between' }}>
                    <Timepicker value={formVal.startTime} id="startTime" onChange={handleChange} name="startTime" label="Start Time" />
                    <Timepicker value={formVal.endTime} id="endTime" onChange={handleChange} name="endTime" label="End Time" />
                </div>
                <div className="flex flex-grow" style={{ justifyContent: 'space-between', margin: '1rem 0' }}>
                    <FormControlLabel
                        control={<Checkbox id="lessonAssistantReq" name="lessonAssistantReq" checked={formVal.lessonAssistantReq} onChange={handleChange} />}
                        label="Lesson Assistant Required?"
                    />
                    <Input style={{ width: '49%' }} name="lessonAssistantCount" disabled={!formVal.lessonAssistantReq} onChange={handleChange} value={formVal.lessonAssistantCount} type="number" placeholder="How many?" />
                </div>
                <div className="flex flex-grow" style={{ justifyContent: 'space-between', margin: '1rem 0' }}>
                    <FormControlLabel
                        control={<Checkbox id="barnCrewReq" name="barnCrewReq" checked={formVal.barnCrewReq} onChange={handleChange} />}
                        label="Barn Crew Required?"
                    />
                    <Input style={{ width: '49%' }} name="barnCrewCount" disabled={!formVal.barnCrewReq} onChange={handleChange} value={formVal.barnCrewCount} type="number" placeholder="How many?" />
                </div>
                <div className="flex flex-grow" style={{ justifyContent: 'space-between', margin: '1rem 0' }}>
                    <FormControlLabel
                        control={<Checkbox id="pastureCrewReq" name="pastureCrewReq" checked={formVal.pastureCrewReq} onChange={handleChange} />}
                        label="Pasture Crew Required?"
                    />
                    <Input style={{ width: '49%' }} name="pastureCrewCount" disabled={!formVal.pastureCrewReq} onChange={handleChange} value={formVal.pastureCrewCount} type="number" placeholder="How many?" />
                </div>
                <div className="flex flex-grow" style={{ justifyContent: 'space-between', margin: '1rem 0' }}>
                    <FormControlLabel
                        control={<Checkbox id="horseLeaderReq" name="horseLeaderReq" checked={formVal.horseLeaderReq} onChange={handleChange} />}
                        label="Horse Leader Required?"
                    />
                    <Input style={{ width: '49%' }} name="horseLeaderCount" disabled={!formVal.horseLeaderReq} onChange={handleChange} value={formVal.horseLeaderCount} type="number" placeholder="How many?" />
                </div>
                <div className="flex flex-grow" style={{ justifyContent: 'space-between', margin: '1rem 0' }}>
                    <FormControlLabel
                        control={<Checkbox id="sidewalkerReq" name="sidewalkerReq" checked={formVal.sidewalkerReq} onChange={handleChange} />}
                        label="Sidewalker Required?"
                    />
                    <Input style={{ width: '49%' }} name="sidewalkerCount" disabled={!formVal.sidewalkerReq} onChange={handleChange} value={formVal.sidewalkerCount} type="number" placeholder="How many?" />
                </div>

                <div className="flex flex-grow" style={{ justifyContent: 'space-between' }}>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="select-instructor">Select Instructor</InputLabel>
                        <Select labelId="instructor" id="instructor" name="instructor" value={formVal.instructor} onChange={handleChange} >
                            {instructorsArr.map((instructor, ind) => <MenuItem key={ind} value={ind}>{instructor}</MenuItem>)}
                        </Select>
                    </FormControl>
                </div>
                <Button color="primary" type="submit" variant="contained" onClick={submitEventRequest} style={{ width: '100%', margin: '3rem 0 0 0' }}>Create Event</Button>
            </form>
        </StyledCard>
    );
}