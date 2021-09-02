import { useEffect } from 'react';
import { useAppDispatch } from './use-app-dispatch';
import { Modal } from '../actions/modal.actions';
import { formatErrorMessage } from '../utility/errors';

export const useEffectError = (error: any, title: string, message: string) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (error) {
      void dispatch(Modal.alert(title, formatErrorMessage(error, message)));
    }
  }, [dispatch, error, title, message]);
};
