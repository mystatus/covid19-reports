import { Dispatch } from 'redux';

export namespace Persist {

  export namespace Actions {

    export class Set<T = any> {

      static type = 'PERSIST_SET';
      type = Set.type;
      constructor(public payload: {
        persistKey: string;
        value: T;
      }) {}

    }

  }

  export const set = <T>(persistKey: string, value: T) => (dispatch: Dispatch<Actions.Set<T>>) => {
    dispatch({ ...new Actions.Set<T>({ persistKey, value }) });
  };

}
