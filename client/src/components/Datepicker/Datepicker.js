import React from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

const PREFIX = 'Datepicker';

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

export default function DatePicker(props) {


  return (
    <Root className={classes.container} noValidate>
      <TextField
        id={props.id}
        label={props.label}
        type="date"
        defaultValue={props.value}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={props.handleDate}
      />
    </Root>
  );
}