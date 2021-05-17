import React, { ReactNode } from 'react';
import useStyles from './page-root.styles';

export type PageRootProps = {
  children: ReactNode
};

export const PageRoot = (props: PageRootProps) => {
  const classes = useStyles();

  return (
    <main className={classes.root}>
      {props.children}
    </main>
  );
};
