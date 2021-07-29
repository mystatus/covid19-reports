import {
  Box,
  Typography,
  TypographyProps,
} from '@material-ui/core';
import React from 'react';
import useStyles from './typography-truncated.styles';

export type TypographyTruncatedProps = TypographyProps & {
  lines: number;
  lineHeight?: number;
};

export const TypographyTruncated = (props: TypographyTruncatedProps) => {
  const { children, lines, lineHeight, variant, ...rest } = props;
  const classes = useStyles({
    lines,
    lineHeight,
    variant,
  });

  return (
    <Box className={classes.root}>
      <Typography
        noWrap={lines === 1}
        {...rest}
      >
        {children}
      </Typography>
    </Box>
  );
};
