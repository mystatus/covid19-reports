import { Dispatch } from 'redux';
import { ModalButton, ModalResponse } from '../reducers/modal.reducer';

export namespace Modal {

  export namespace Actions {

    export class Alert {
      static type = 'MODAL_ALERT';
      type = Alert.type;
      constructor(
        public payload: {
          buttons?: ModalButton[],
          message: string,
          open: boolean,
          title: string,
        },
        public resolve: (response: ModalResponse) => void,
      ) {}
    }

    export class Close {
      static type = 'MODAL_CLOSE';
      type = Close.type;
      constructor(
        public payload: {
          title: string,
          response: ModalResponse,
        },
      ) {}
    }
  }

  export const alert = (title: string, message: string, buttons: ModalButton[] = [{ text: 'OK' }]): Promise<ModalResponse> => {
    return ((dispatch: Dispatch<Actions.Alert>) => {
      return new Promise(resolve => {
        dispatch(new Actions.Alert({ buttons, open: true, message, title }, resolve));
      });
    }) as unknown as Promise<ModalResponse>;
  };

  export const confirm = (title: string, message: string, options?: {
    destructive?: boolean,
    confirmText?: string,
    cancelText?: string,
  }) => {
    const {
      destructive = false,
      confirmText = 'Confirm',
      cancelText = 'Cancel',
    } = options ?? {};

    return alert(title, message, [{
      text: confirmText,
      value: true,
      destructive,
    }, {
      text: cancelText,
      value: false,
      destructive: false,
      variant: 'outlined',
    }]);
  };

  export const close = (title: string, response: ModalResponse) => (dispatch: Dispatch<Actions.Close>) => {
    dispatch(new Actions.Close({ title, response }));
  };

}
