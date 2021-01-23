import { Dispatch } from 'redux';

export namespace Modal {

  export namespace Actions {

    export class Alert {
      static type = 'MODAL_ALERT';
      type = Alert.type;
      constructor(public payload: {
        message: string,
        open: boolean,
        title: string,
      }) {}
    }

    export class Close {
      static type = 'MODAL_CLOSE';
      type = Close.type;
    }

  }

  export const alert = (title: string, message: string) => (dispatch: Dispatch<Actions.Alert>) => {
    dispatch(new Actions.Alert({ open: true, message, title }));
  };

  export const close = () => (dispatch: Dispatch<Actions.Close>) => {
    dispatch(new Actions.Close());
  };

}
