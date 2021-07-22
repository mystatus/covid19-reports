import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { Modal as ModalActions } from '../../actions/modal.actions';
import {
  ModalButton,
  ModalState,
} from '../../reducers/modal.reducer';
import { AppState } from '../../store';
import useStyles from './modal.styles';

const defaultButtons: ModalButton[] = [
  { text: 'Ok' },
];

export const ModalProvider = () => {
  const classes = useStyles();
  const { buttons, message, open, title } = useSelector<AppState, ModalState>(state => state.modal);
  const dispatch = useDispatch();

  if (!open) {
    return null;
  }

  const onClose = (index?: number) => dispatch(ModalActions.close(title, index !== undefined ? {
    button: buttons[index],
    index,
  } : null));

  return (
    <Dialog
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
        {(buttons ?? defaultButtons).map(({ text, destructive, ...rest }, index) => (
          <Button
            key={text}
            className={rest.className ?? (destructive) ? classes.destructiveButton : undefined}
            onClick={() => onClose(index)}
            {...rest}
          >
            {text}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
};
