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
import {
  requireOrgAccess,
  requireUserAuth,
  requireWorkspaceAccess,
} from './auth';
import { env } from './util/env';
import { errorHandler } from './util/error-handler';
import { Log } from './util/log';

const start = async () => {
  try {
    await database;
    Log.info('Database ready');
  } catch (err) {
    Log.error('Database connection failed: ', err);
  }

  if (env.isDev) {
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
  if (!env.isTest) {
    app.use(morgan((tokens, req: any, res: any) => {
      return [
        req.appUser.edipi,
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
      ].join(' ');
    }));
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
    requireWorkspaceAccess,
    kibanaDashboard,
  );

  app.use(
    '/onboarding-doc',
    (req: Request, res: Response) => {
      res.redirect(`${config.links.onboarding}`);
    },
  );

  app.use(
    config.kibana.basePath,
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
      Log.info(`🚀 Server ready at https://127.0.0.1:${PORT}`);
    });
  } else {
    app.listen(PORT, () => {
      Log.info(`🚀 Server ready at http://127.0.0.1:${PORT}`);
    });
  }
};

export default start();
