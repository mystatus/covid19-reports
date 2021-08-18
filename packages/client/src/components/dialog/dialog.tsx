import React from 'react';
import {
  Dialog as MuiDialog,
  DialogProps,
} from '@material-ui/core';

/**
 * Wrapper for Material UI Dialog class to allow us to set default behavior for
 * onClose().
 */
export const Dialog = (props: DialogProps) => {
  const { onClose, children, ...otherProps } = props;

  const handleClose = (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => {
    if (reason !== 'backdropClick') {
      if (onClose) {
        onClose(event, reason);
      }
    }
  };

  return (
    <MuiDialog
      {...otherProps}
      onClose={handleClose}
    >
      {children}
    </MuiDialog>
  );
};
