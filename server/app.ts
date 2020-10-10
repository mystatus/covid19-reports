import express, { Request, Response } from 'express';
import 'express-async-errors';
import process from 'process';
import passport from 'passport';
import https from 'https';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import apiRoutes from './api';
import kibanaProxy from './kibana';
import kibanaDashboard from './kibana/dashboard';
import database from './sqldb';
import config from './config';
import { requireOrgAccess, requireUserAuth, requireWorkspaceAccess } from './auth';
import { errorHandler } from './util/error-handler';

database.then(() => {
  console.log('Database ready');
}).catch(err => {
  console.log('Database connection failed: ', err);
});

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

const app = express();

//
// Middlware
//

app.use(requireUserAuth);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('tiny'));
}

//
// Routes
//
app.get('/heartbeat', (req: Request, res: Response) => {
  res.status(204).send();
});

app.use('/api', apiRoutes);
app.use(
  '/dashboard',
  requireOrgAccess,
  kibanaDashboard,
);

app.use(
  config.kibana.appPath,
  requireOrgAccess,
  requireWorkspaceAccess,
  kibanaProxy,
);

app.get('/*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Not found
app.all('*', (req: Request, res: Response) => {
  res.status(404).send({
    error: {
      message: 'Not found.',
      type: 'NotFound',
    },
  });
});

// Error handler
app.use(errorHandler);

//
// Start the server
//
const PORT = process.env.PORT || 4000;

if (process.env.SERVER_KEY && process.env.SERVER_CERT) {
  const opts = {
    key: fs.readFileSync(process.env.SERVER_KEY),
    cert: fs.readFileSync(process.env.SERVER_CERT),
  };
  https.createServer(opts, app).listen(PORT, () => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`🚀 Server ready at https://127.0.0.1:${PORT}`);
    }
  });
} else {
  app.listen(PORT, () => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`🚀 Server ready at http://127.0.0.1:${PORT}`);
    }
  });
}

export default app;
