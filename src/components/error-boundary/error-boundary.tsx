import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from '@material-ui/core';
import React, { ReactNode, ErrorInfo } from 'react';
import { formatMessage } from '../../utility/errors';


export interface ErrorBoundaryProps {
  children?: ReactNode,
  errorTitle?: string,
  errorMessage?: string,
}

export interface ErrorBoundaryState {
  error?: Error | null,
  errorInfo?: ErrorInfo | null,
  alertTitle?: string,
  alertMessage?: string,
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

    this.setState({
      error,
      errorInfo,
      alertTitle: this.props?.errorTitle ?? 'Error',
      alertMessage: message,
    });
  }

  render() {

    return (
      <>
        {this.props.children}
        {this.state.error && (
        <Dialog
          open
          onClose={() => {
            this.setState(initialState);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{this.state.alertTitle || 'Alert'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.alertMessage}
            </DialogContentText>
            {this.state.errorInfo && (
            <DialogContentText>
              {this.state.errorInfo}
            </DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              this.setState(initialState);
            }}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
        )}
      </>
    );
  }
}
