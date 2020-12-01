import React, { ReactNode, ErrorInfo } from 'react';
import { formatMessage } from '../../utility/errors';
import { AlertDialog, AlertDialogProps } from '../alert-dialog/alert-dialog';


export interface AlertErrorProps {
  message?: string,
  alertTitle?: string,
  error?: Error,
  info?: ErrorInfo,
}

export class AlertError extends Error {
  readonly alertTitle?: string;
  readonly error?: Error;
  readonly info?: ErrorInfo;

  constructor(props: AlertErrorProps) {
    super(props.message);
    this.alertTitle = props.alertTitle;
    this.error = props.error;
    this.info = props.info;
  }
}


export interface ErrorBoundaryProps {
  children?: ReactNode,
  alertTitle?: string,
  errorMessage?: string,
  alertDialogProps: AlertDialogProps,
  setAlertDialogProps: (props: AlertDialogProps) => void,
}

export interface ErrorBoundaryState {
  hasError: boolean,
  error?: AlertError,
}

const initialState: ErrorBoundaryState = { hasError: false };


export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = initialState;
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const { errorMessage, alertTitle } = this.props;
    const message = error.message ?? formatMessage(error, errorMessage ?? '');

    let err = error as AlertError;
    if (!err) {
      err = new AlertError({
        error,
        info,
        message,
        alertTitle: alertTitle ?? 'Error',
      });
    }

    this.setState({
      hasError: true,
      error: err,
    });

    this.props.setAlertDialogProps({
      open: true,
      title: this.state.error?.alertTitle ?? 'Error',
      message,
      onClose: () => { this.props.setAlertDialogProps({ open: false }); },
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          {this.props.children}
          <AlertDialog {...this.props.alertDialogProps} />
        </>
      );
    }
    return this.props.children;
  }
}
