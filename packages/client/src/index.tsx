import 'reflect-metadata';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { PersistGate } from 'redux-persist/integration/react';
import { App } from './components/app';
import { configureStore } from './store';
import theme from './theme';
import { ErrorBoundary } from './components/error-boundary/error-boundary';
import { ModalProvider } from './components/modal/modal';

const { store, persistor } = configureStore();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ModalProvider />
          <Router>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </Router>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
