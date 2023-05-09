import React from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

const PREFIX = 'Timepicker';

const classes = {
  container: `${PREFIX}-container`,
  textField: `${PREFIX}-textField`
};

const Root = styled('form')((
  {
    theme
  }
) => ({
  [`&.${classes.container}`]: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1
  },

  [`& .${classes.textField}`]: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '100%'
  }
}));

export default function Timepicker(props) {


  return (
    <Root className={classes.container} noValidate>
      <TextField
        id={props.id}
        label={props.label}
        type="time"
        defaultValue={props.value}
        className={classes.textField}
        onChange={props.onChange}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 300, // 5 min
        }}
      />
    </Root>
  );
}
