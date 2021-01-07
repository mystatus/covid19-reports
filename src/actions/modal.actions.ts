import { Dispatch } from 'redux';

export namespace Modal {

  export namespace Actions {

    export class Open {
      static type = 'MODAL_OPEN';
      type = Open.type;
      constructor(public payload: {
        message: string,
        open: boolean,
        title: string,
      }) {}
    }

    export class Close {
      static type = 'MODAL_CLOSE';
      type = Close.type;
      constructor(public payload: {
        button?: string,
      }) {}
    }

  }

  export const openModal = (title: string, message: string) => (dispatch: Dispatch<Actions.Open>) => {
    dispatch(new Actions.Open({ open: true, message, title }));
  };

  export const closeModal = (button?: string) => (dispatch: Dispatch<Actions.Close>) => {
    dispatch(new Actions.Close({ button }));
  };

}
