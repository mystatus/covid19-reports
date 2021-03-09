import { ButtonProps } from '@material-ui/core';
import { Modal } from '../actions/modal.actions';

export interface ModalButton extends ButtonProps {
  text: string,
  value?: any,
}

export type ModalResponse = {
  button: ModalButton,
  index: number,
} | null;

export interface ModalState {
  buttons: ModalButton[],
  message: string,
  open: boolean,
  title: string,
}

export const modalInitialState: ModalState = {
  buttons: [],
  open: false,
  message: '',
  title: '',
};

export type ResolverStore = {
  [key: string]: (response: ModalResponse) => void
};

export const modalResolverStore: ResolverStore = {};

export function modalResolverHandler() {
  return (next: (any: any) => any) => (action: any) => {
    if (action.type === 'MODAL_ALERT') {
      const { payload, resolve } = (action as Modal.Actions.Alert);
      modalResolverStore[payload.title] = resolve;
    }
    if (action.type === 'MODAL_CLOSE') {
      const payload = (action as Modal.Actions.Close).payload;
      if (typeof modalResolverStore[payload.title] === 'function') {
        modalResolverStore[payload.title](payload.response);
        delete modalResolverStore[payload.title];
      }
    }
    return next(action);
  };
}

export function modalReducer(state = modalInitialState, action: any): ModalState {
  switch (action.type) {
    case Modal.Actions.Alert.type: {
      return {
        ...state,
        ...(action as Modal.Actions.Alert).payload,
      };
    }
    case Modal.Actions.Close.type: {
      return {
        ...state,
        open: false,
      };
    }
    default:
      return state;
  }
}
