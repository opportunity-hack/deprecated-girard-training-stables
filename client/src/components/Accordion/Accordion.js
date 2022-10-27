import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import './Accordion.css';

const Accordion = withStyles({
  root: {
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
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'white',
    boxShadow: '2px 4px 8px #ababab',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {

      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
    padding: theme.spacing(2),
  }
}))(MuiAccordionDetails);

export default function CustomAccordion(props) {
const [expanded, setExpanded] = React.useState('');
const [subExpanded, setSubExpanded] = React.useState('');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  const handleSubChange = (panel) => (event, newExpanded) => {
    setSubExpanded(newExpanded ? panel : false);
  };

  let data = props.data;

  const handleSignUpForEvent = (position) => {
    //TODO: SIGN UP FLOW
    //window.alert(position);
    console.log(position);
  }

  return (
        <div>
            <CloseIcon style={{float: 'right', fontSize: '2rem', cursor: 'pointer'}} onClick={props.handleClose} />
            <div className="modal-heading">{data.title}- {data.start.toDateString()}</div>
            {
                data && Object.keys(data.volunteers).map((pos, index) => {
                    return (
                      <div>
                          <Accordion key={index} square expanded={expanded === `panel-${index}`} onChange={handleChange(`panel-${index}`)}>
                              <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                <Typography>{pos}</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                  <Accordion key={index} square expanded={subExpanded === `subpanel-${pos}-${index}`} onChange={handleSubChange(`subpanel-${pos}-${index}`)}>
                                      <AccordionSummary id={`subpanel-${index}-header`} >
                                          <div style={{ display: 'flex', flex: '1 1 auto', justifyContent: 'space-between', alignItems: 'center', verticalAlign:'center', height: '1rem'}}>
                                              <div>{data.volunteers[pos].signedUp.length} of {data.volunteers[pos].minVolunteers} filled</div>
                                              {data.volunteers[pos].minVolunteers - data.volunteers[pos].signedUp.length !== 0 ? <Button key={index} variant="contained" color="primary" onClick={handleSignUpForEvent(pos)}>Sign up</Button> : <></>}
                                          </div>
                                      </AccordionSummary>
                                  </Accordion>
                              </AccordionDetails>
                          </Accordion>
                      </div>
                    )
                })
            }
            
        </div>
  );
}
