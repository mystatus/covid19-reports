import React from 'react';
import useStyles from './button-set.styles';

type ButtonSetProps = {
  children?: React.ReactNode;
};

export const ButtonSet = (props: ButtonSetProps) => {
  const classes = useStyles();

  return (
    <div className={classes.buttons}>
      {props.children}
    </div>
  );
};
