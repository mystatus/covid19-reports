import React, { ReactNode, ErrorInfo, useState } from 'react';
import { formatMessage } from '../../utility/errors';
import { AlertDialog, AlertDialogProps } from '../alert-dialog/alert-dialog';


export interface ErrorBoundaryProps {
  children?: ReactNode,
  alertTitle?: string,
  errorMessage?: string,
}

export interface ErrorBoundaryState {
  hasError: boolean,
  error?: Error,
  info?: ErrorInfo,
  message?: string,
}

const initialState: ErrorBoundaryState = { hasError: false };


const [alertDialogProps, setAlertDialogProps] = useState<AlertDialogProps>({ open: false });


export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = initialState;
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const { errorMessage } = this.props;
    const message = formatMessage(error, errorMessage ?? '');
    console.error('Uncaught error:', error, info);
    this.setState({ hasError: true });
    setAlertDialogProps({
      open: true,
      title: this.props.alertTitle,
      message,
    });
  }

  render() {
    if (this.state.hasError) {
      return <AlertDialog {...alertDialogProps} />;
    }
    return this.props.children;
  }
}
