import React, { ErrorInfo } from 'react';
import { Snackbar, SnackbarOrigin } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { formatErrorMessage } from '../../utility/errors';


export interface ErrorBoundaryState {
  error?: Error | null;
  message?: string;
}

const initialState: ErrorBoundaryState = {
  error: null,
};


export class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {

  constructor(props: any) {
    super(props);
    this.state = initialState;
    this.handleClose = this.handleClose.bind(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const message = error.message ?? formatErrorMessage(error, '');

    this.setState({
      error,
      message,
    });
  }

  handleClose() {
    this.setState(initialState);
  }


  render() {
    const origin: SnackbarOrigin = {
      vertical: 'top',
      horizontal: 'center',
    };
    return (
      <>
        {this.state.error && (
          <Snackbar open onClose={this.handleClose} anchorOrigin={origin}>
            <Alert onClose={this.handleClose} severity="error">
              {this.state.message}
            </Alert>
          </Snackbar>
        )}
        {this.props.children}
      </>
    );
  }

}
