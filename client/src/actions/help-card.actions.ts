import { Dispatch } from 'redux';

export namespace HelpCard {

  export namespace Actions {

    export class Hide {
      static type = 'HELP_TEXT_HIDE';
      type = Hide.type;
      constructor(public payload: {
        helpCardId: string
      }) {}
    }

  }

  export const hide = (helpCardId: string) => (dispatch: Dispatch<Actions.Hide>) => {
    dispatch(new Actions.Hide({ helpCardId }));
  };

}
