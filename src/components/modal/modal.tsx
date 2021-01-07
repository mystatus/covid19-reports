import React, { ReactNode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import {
  Button,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import useStyles from './modal.styles';
import { Modal as ModalActions } from '../../actions/modal.actions';
import { ModalState } from '../../reducers/modal.reducer';
import { AppState } from '../../store';

export interface ModalButtonProps {
  text: string
}

export interface ModalProps {
  open: boolean,
  title?: string,
  inline?: boolean,
  message?: string,
  children?: ReactNode,
  buttons?: ModalButtonProps[],
  onClose?: (button?: ModalButtonProps) => boolean,
}

export const Modal = ({ children }: ModalProps) => {
  return ReactDOM.createPortal(children, document.getElementById('#modal-provider-content')!);
};

export const ModalProvider = () => {
  const { message, open, title } = useSelector<AppState, ModalState>(state => state.modal);
  const dispatch = useDispatch();
  const classes = useStyles();
  const buttons = [{
    text: 'OK',
  }];
  const onClose = (button?: ModalButtonProps) => {
    dispatch(ModalActions.closeModal(button?.text));
  };

  if (!open) {
    return null;
  }

  return (
    <Dialog
      className={classes.root}
      open={open}
      onClose={() => onClose()}
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
          <Button key={button.text} onClick={() => onClose(button)}>
            {button.text}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
};
