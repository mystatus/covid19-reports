import React from 'react';
import {
  Box,
  LinearProgress,
  LinearProgressProps,
  Typography,
} from '@material-ui/core';

export const LinearProgressWithPercent = (props: LinearProgressProps & { value: number }) => {
  return (
    <Box display="flex" alignItems="center" flex={1}>
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
};
