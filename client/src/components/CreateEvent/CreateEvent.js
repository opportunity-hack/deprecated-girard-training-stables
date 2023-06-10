import React, { useState, useEffect } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { useAuth0 } from "@auth0/auth0-react";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

import httpClient from "../../httpClient";

export default function CreateEvent(props) {
  const [formVal, setFormValue] = useState({
    startDate: dayjs(),
    endDate: dayjs().add(1, 'hour'),
    lessonAssistantCount: 0,
    horseLeaderCount: 0,
    barnCrewCount: 0,
    pastureCrewCount: 0,
    sidewalkerCount: 0,
    instructor: "",
    title: "",
  });

  const [instructors, setInstructors] = useState({});
  const [instructorsArr, setInstructorsArr] = useState([]);

  useEffect(() => {
    httpClient
      .get(process.env.REACT_APP_API_SERVER + "/users")
      .then((res) => {
        var map = new Map(
          res.data.map((obj) => {
            return [obj.firstName, obj];
          })
        );
        setInstructors(map);
        setInstructorsArr(Array.from(map.keys()));
      })
      .catch((err) => console.log(err.data));
  }, []);

  const { user } = useAuth0();
  const isAdmin =
    user?.["https://girard-server.herokuapp.com/roles"]?.includes("admin");
  if (!isAdmin) {
    return <div>You aren't authorised to create new events.</div>;
  }

  const handleChange = (event) => {
    let field = event.target.name || event.target.id;
    let value = event.target.value

    setFormValue({
      ...formVal,
      [field]: value,
    });
  };

  const submitEventRequest = (e) => {
    e.preventDefault();
    let formData = {};
    formData.instructor = instructors.get(instructorsArr[formVal.instructor]);
    formData.volunteers = {
      "barn crew": {
        minVolunteers: formVal.barnCrewCount || 0,
        signedUp: [],
      },
      "pasture crew": {
        minVolunteers: formVal.pastureCrewCount || 0,
        signedUp: [],
      },
      "lesson assistant": {
        minVolunteers: formVal.lessonAssistantCount || 0,
        signedUp: [],
      },
      sidewalker: {
        minVolunteers: formVal.sidewalkerCount || 0,
        signedUp: [],
      },
      "horse leader": {
        minVolunteers: formVal.horseLeaderCount || 0,
        signedUp: [],
      },
    };
    formData.horses = [];
    formData.notes = "";

    const form = {
      start: formVal.startDate,
      end: formVal.endDate,
      instructor: formData.instructor,
      volunteers: formData.volunteers,
      horses: null,
      notes: "",
      title: formVal.title,
    };

    httpClient
      .post(process.env.REACT_APP_API_SERVER + "/lessons", form)
      .then((res) => {
        let events = JSON.parse(JSON.stringify(props.data));
        res.data.start = new Date(res.data.start);
        res.data.end = new Date(res.data.end);
        events.push(res.data);
        props.submit(events);
      })
      .catch((err) => console.log(err.data));
  };

  return (
    <Container maxWidth="sm" sx={{ mb: 4 }}>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography variant="h4" sx={{ mb: 3 }}>Create New Event</Typography>
        <form className="event-form" onSubmit={submitEventRequest}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="title"
                onChange={handleChange}
                label="Lesson Title"
                value={formVal.title}
                placeholder="Horse training session"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ minWidth: 250 }}>
                <InputLabel id="select-instructor">
                  Instructor
                </InputLabel>
                <Select
                  fullWidth
                  labelId="instructor"
                  id="instructor"
                  name="instructor"
                  value={formVal.instructor}
                  onChange={handleChange}
                >
                  {instructorsArr.map((instructor, ind) => (
                    <MenuItem key={ind} value={ind}>
                      {instructor}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                id="startDate"
                name="startDate"
                label="Start Date"
                handleDate={handleChange}
                value={formVal.startDate}
                defaultValue={dayjs()}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                id="endDate"
                name="endDate"
                label="End Date"
                handleDate={handleChange}
                value={formVal.endDate}
                defaultValue={dayjs()}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
        <Typography variant="h6">Volunteer Requirements</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                inputProps={{min: 0}}
                label="Lesson Assistants"
                name="lessonAssistantCount"
                onChange={handleChange}
                value={formVal.lessonAssistantCount}
                type="number"
                placeholder="How many?"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                inputProps={{min: 0}}
                label="Barn Crew Volunteers"
                name="barnCrewCount"
                onChange={handleChange}
                value={formVal.barnCrewCount}
                type="number"
                placeholder="How many?"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                inputProps={{min: 0}}
                label="Pasture Crew Volunteers"
                name="pastureCrewCount"
                onChange={handleChange}
                value={formVal.pastureCrewCount}
                type="number"
                placeholder="How many?"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                inputProps={{min: 0}}
                label="Horse Leaders"
                name="horseLeaderCount"
                onChange={handleChange}
                value={formVal.horseLeaderCount}
                type="number"
                placeholder="How many?"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                inputProps={{min: 0}}
                label="Side Walkers"
                name="sidewalkerCount"
                onChange={handleChange}
                value={formVal.sidewalkerCount}
                type="number"
                placeholder="How many?"
              />
            </Grid>
          </Grid>
            <Button
              color="primary"
              type="submit"
              variant="contained"
              onClick={submitEventRequest}
              sx={{ mt: 3, ml: 1 }}
            >
              Create Event
            </Button>
        </form>
      </Paper>
    </Container>
  );
}
