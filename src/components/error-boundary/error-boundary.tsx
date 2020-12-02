import React, { ReactNode, ErrorInfo } from 'react';
import { AlertError, formatMessage } from '../../utility/errors';
import { AlertDialog, AlertDialogProps } from '../alert-dialog/alert-dialog';


export interface ErrorDialogProps extends AlertDialogProps {
  errorInfo?: ErrorInfo | null,
}

export const ErrorDialog = (props: ErrorDialogProps) => {
  return AlertDialog(props);
};


export interface ErrorBoundaryProps {
  children?: ReactNode,
  errorTitle?: string,
  errorMessage?: string,
  errorDialogProps: ErrorDialogProps,
  setErrorDialogProps: (props: ErrorDialogProps) => void,
}

export interface ErrorBoundaryState {
  error?: AlertError | null,
  errorInfo?: ErrorInfo | null,
}

const initialState: ErrorBoundaryState = {
  error: null,
  errorInfo: null,
};


export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = initialState;
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { errorMessage } = this.props;
    const message = error.message ?? formatMessage(error, errorMessage ?? '');

    if (error instanceof AlertError) {
      this.setState({
        error,
        errorInfo,
      });

      this.props.setErrorDialogProps({
        open: true,
        title: this.state.error?.title ?? 'Error',
        message,
        errorInfo: this.state.errorInfo,

        onClose: () => {
          this.props.setErrorDialogProps({ open: false });
          this.setState(initialState);
        },
      });

    } else {
      // TODO: send exceptions to logstash?
      this.setState(initialState);
      console.exception(message, error, errorInfo);
    }
  }

  render() {
    return (
      <>
        {this.props.children}
        {this.state.error && (
        <ErrorDialog {...this.props.errorDialogProps} />
        )}
      </>
    );
  }
}
