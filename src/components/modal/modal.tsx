import React from 'react';
import {
  Button,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { Modal as ModalActions } from '../../actions/modal.actions';
import { ModalState } from '../../reducers/modal.reducer';
import { AppState } from '../../store';

export const ModalProvider = () => {
  const { message, open, title } = useSelector<AppState, ModalState>(state => state.modal);
  const dispatch = useDispatch();
  const buttons = [{
    text: 'OK',
  }];
  const onClose = () => dispatch(ModalActions.close());

  if (!open) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="modal-dialog-title"
      aria-describedby="modal-dialog-description"
    >
      {title && <DialogTitle id="modal-dialog-title">{title}</DialogTitle>}
      <DialogContent>
        <DialogContentText id="modal-dialog-description">
          {/* eslint-disable-next-line react/no-danger */}
          <span dangerouslySetInnerHTML={{ __html: message ?? '' }} />
        </DialogContentText>
        <div id="modal-provider-content" />
      </DialogContent>
      <DialogActions>
        {buttons.map(button => (
          <Button key={button.text} onClick={onClose}>
            {button.text}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
};
