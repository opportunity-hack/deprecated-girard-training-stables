import React from 'react';
import { styled } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';

const PREFIX = 'Modal';

const classes = {
    modal: `${PREFIX}-modal`,
    paper: `${PREFIX}-paper`
};

const Root = styled('div')((
    {
        theme
    }
) => ({
    [`& .${classes.modal}`]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        outline: 0
      },

    [`& .${classes.paper}`]: {
        position: 'absolute',
        minWidth: '80vw',
        minHeight: '60vh',
        outline: 0,
        backgroundColor: 'white',
        boxShadow: '2px 6px 8px #ababab',
        padding: theme.spacing(2, 4, 3),
    }
}));

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

export default function SimpleModal(props) {

    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    
    return (
        <Root>
          <Modal
              open={props.open}
              onClose={props.handleClose}
              className={classes.modal}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
              timeout: 500,
              }}
          >
              <Fade in={props.open}>
                  <div className={classes.paper}>
                      {props.body}
                  </div>
              </Fade>
                  

          </Modal>
        </Root>
    );
  }