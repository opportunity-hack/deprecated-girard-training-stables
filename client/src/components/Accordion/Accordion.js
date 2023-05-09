import React from 'react';
import { styled } from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import './Accordion.css';
import { v4 } from 'uuid';
import { useAuth0  } from '@auth0/auth0-react';
import axios from 'axios';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';


const PREFIX = 'Accordion';

const classes = {
  root: `${PREFIX}-root`,
  expanded: `${PREFIX}-expanded`,
  root2: `${PREFIX}-root2`,
  content: `${PREFIX}-content`,
  expanded2: `${PREFIX}-expanded2`,
  root3: `${PREFIX}-root3`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.root}`]: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
    },
  },

  [`& .${classes.expanded}`]: {},

  [`& .${classes.root2}`]: {
    backgroundColor: 'white',
    boxShadow: '2px 4px 8px #ababab',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },

  [`& .${classes.content}`]: {
    '&$expanded': {
      margin: '12px 0',
    },
  },

  [`& .${classes.expanded2}`]: {},

  [`& .${classes.root3}`]: {

      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
    padding: theme.spacing(2),
  }
}));


const Accordion = MuiAccordion;

const AccordionSummary = MuiAccordionSummary;

const AccordionDetails = MuiAccordionDetails;

export default function CustomAccordion(props) {
const [expanded, setExpanded] = React.useState('');
const [subExpanded, setSubExpanded] = React.useState('');
const [UserID, setUserID] = React.useState('');
const [AdvancedAccess, setAccess] = React.useState(false);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  const handleSubChange = (panel) => (event, newExpanded) => {
    setSubExpanded(newExpanded ? panel : false);
  };

  const {user, isAuthenticated, isLoading} = useAuth0();

  const volunteerDescriptions = {
    "barn crew": "Barn Crew volunteers help with the daily care of the horses. This includes feeding, watering, and cleaning stalls. Barn Crew volunteers must be at least 16 years old.",
    "pasture crew" : "Pasture Crew volunteers help with the daily care of the horses. This includes feeding, watering, and cleaning pastures. Pasture Crew volunteers must be at least 16 years old.",
    "lesson assistant" : "Lesson Assistant volunteers help with the daily care of the horses. This includes feeding, watering, and cleaning stalls. Lesson Assistant volunteers must be at least 16 years old.",
    "sidewalker" : "Sidewalker volunteers help with the daily care of the horses. This includes feeding, watering, and cleaning stalls. Sidewalker volunteers must be at least 16 years old.",
    "horse leader" : "Horse Leader volunteers help with the daily care of the horses. This includes feeding, watering, and cleaning stalls. Horse Leader volunteers must be at least 16 years old."
  }


  if (isLoading) {
    return <Root>Loading ...</Root>;
  }

  let data = props.data;
  console.log("Props Data:", data);

  if(isAuthenticated)
  {
    var safeEmail = user.email;
  }
  else
  {
    var safeEmail = "BAD@gmail.com"
  }
  console.log("Email for Register:", safeEmail);
  axios.get('http://localhost:2222/users', { params: { email: safeEmail } } )
  .then(res => {
    //Check for the users id in the signed up users
    setUserID(res.data._id);

    //Check if user is an admin
    if(res.data.userType === 'volunteer coordinator')
    {
      setAccess(true);
    }
  })
  .catch(err => console.log("Error-Checking-Registered: ", err.data));

  

  const CheckForRegister = (data, position) => {
    let newLesson = data;
    let UserIndex = newLesson.volunteers[position].signedUp.indexOf(UserID);
    if(UserIndex === -1)
    {
      return false;
    }
    else
    {
      return true;
    }

  }


  const DeleteEvent = (data) => {
    let urlExtension = '/lessons/'+data._id;
    axios.delete(urlExtension)
      .then(result => console.log("delete lesson result:", result))
      .catch(error => console.log("delete lesson error:", error))
    props.handleClose();
  }


  const handleSignUpForEvent = (data, position) => {
    // TODO: SIGN UP FOR EVENT    
    console.log("Accordion handleSignUpForEvent");
    console.log("data:", data);
    console.log("position:", position);
    console.log("volunteers in position:",data.volunteers[position]);


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
        console.log('user ID:', res.data._id);
        
        
        let newLesson = data;
        newLesson.volunteers[position].signedUp.push(res.data._id);
        console.log(newLesson);

        let urlExtension = '/lessons/' + newLesson._id;
        axios.put(urlExtension, {data : newLesson, email: safeEmail}, { params: {signedUp: true} } )
          .then(result => console.log("put new lesson result:", result))
          .catch(error => console.log("put new lesson error:", error))
        
      })
      .catch(err => console.log("Error-Register_for_event: ", err.data));
      props.handleClose();
  }




  const handleUnRegisterForEvent = (data, position) => {
    console.log("Accordion handleUnRegisterForEvent");
    console.log("data:", data);
    console.log("position:", position);

    console.log("volunteers in position:",data.volunteers[position]);


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
        console.log('user ID:', res.data._id);
        
        let newLesson = data;

        //Get the index of the user Unregistering
        let UserIndex = newLesson.volunteers[position].signedUp.indexOf(res.data._id);
        console.log("Index to be removed:", UserIndex);

        if(UserIndex != -1)
        {
          //Remove user from array
          newLesson.volunteers[position].signedUp.splice(UserIndex,1)
        }
        else
        {
          //Log error
          console.log("Error: User not found to Remove");
        }

        console.log("Lesson after user was removed:", newLesson);

        let urlExtension = '/lessons/' + newLesson._id;
        axios.put(urlExtension, {data : newLesson, email: safeEmail}, { params: {signedUp: false} })
          .then(result => console.log("put new lesson result:", result))
          .catch(error => console.log("put new lesson error:", error))
      })
      .catch(err => console.log("Error-Register_for_event: ", err.data));
      props.handleClose();
  }

  return (
    <div>
        <CloseIcon style={{float: 'right', fontSize: '2rem', cursor: 'pointer'}} onClick={props.handleClose} />
        <div className="modal-heading">{data.title} - {data.start.toDateString()}</div>
        {
          data && Object.keys(data.volunteers).map((pos, index) => {
            return (
              <div key={v4()}>
                {data.volunteers[pos].minVolunteers >= 1 ?
                  <Accordion
                    key={v4()}
                    square
                    expanded={expanded === `panel-${index}`}
                    onChange={handleChange(`panel-${index}`)}
                    classes={{
                      root: classes.root,
                      expanded: classes.expanded
                    }}>
                      <AccordionSummary
                        aria-controls="panel1d-content"
                        id={`panel1d-header-${index}`}
                        classes={{
                          root: classes.root2,
                          content: classes.content,
                          expanded: classes.expanded2
                        }}>
                      <Stack direction="column" spacing={1}>
                        <Stack direction="row" spacing={1}>
                          <Chip label={data.volunteers[pos].signedUp.length === data.volunteers[pos].minVolunteers ? "Full" : "Open"} />                            
                            <Typography>{pos}</Typography>
                            <Chip label={`${data.volunteers[pos].signedUp.length} of ${data.volunteers[pos].minVolunteers} filled`} />                                                                                          
                        </Stack>
                      <Typography className="muted">{volunteerDescriptions[pos]}</Typography>
                      </Stack>
                      </AccordionSummary>
                      <AccordionDetails
                        classes={{
                          root: classes.root3
                        }}>
                          <Accordion
                            key={v4()}
                            square
                            expanded={subExpanded === `subpanel-${pos}-${index}`}
                            onChange={handleSubChange(`subpanel-${pos}-${index}`)}
                            classes={{
                              root: classes.root,
                              expanded: classes.expanded
                            }}>
                              <AccordionSummary
                                id={`subpanel-${index}-header`}
                                classes={{
                                  root: classes.root2,
                                  content: classes.content,
                                  expanded: classes.expanded2
                                }}>
                                <div style={{ display: 'flex', flex: '1 1 auto', justifyContent: 'space-between', alignItems: 'center', verticalAlign:'center', height: '1rem'}}>
                                    <div>{data.volunteers[pos].signedUp.length} of {data.volunteers[pos].minVolunteers} filled</div>
                                    {data.volunteers[pos].minVolunteers - data.volunteers[pos].signedUp.length !== 0 && !CheckForRegister(data, pos) ? <Button variant="contained" color="primary" onClick={() => handleSignUpForEvent(data, pos)}>Sign up</Button> : <></>}
                                    {CheckForRegister(data, pos) ? <Button variant="contained" color="primary" onClick={() => handleUnRegisterForEvent(data, pos)}>Unregister</Button> : <></>}
                                </div>
                              </AccordionSummary>
                          </Accordion>
                      </AccordionDetails>
                  </Accordion>
                : <></>}
              </div>
            );
          })
        }

        {AdvancedAccess ? <div>
          <Button style={{left: "45%", bottom: "-2em", backgroundColor: "#f44336"}} variant="contained" onClick={() => DeleteEvent(data)}>Delete Lesson</Button>
        </div> : <></>}
    </div>
  );
}
