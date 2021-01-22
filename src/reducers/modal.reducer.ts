import { Modal } from '../actions/modal.actions';

export interface ModalState {
  message: string,
  open: boolean,
  title: string,
}

export const modalInitialState: ModalState = {
  open: false,
  message: '',
  title: '',
};

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
