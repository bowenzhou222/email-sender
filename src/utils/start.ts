import * as express from 'express';
import { config } from './../config';
import { logger } from './log';

const start = (app: express.Express, port?: string): void => {
  listen(app, port);
};

const listen = (app: express.Express, port?: string): void => {
  try {
    checkConfiguration();
    app.listen(port ? port : config.port, (err: any) => {
      if (err) {
        logger('error', err);
      }
      logger('info', `----------------- App started on port ${port ? port : config.port} -----------------`);
      logger('info', `----------------- ${config.app_version} -----------------`);
    });
  } catch (errors) {
    logger('error', '----------------- Configuration errors -----------------');
    errors.forEach((err: any) => {
      logger('error', err);
    });
  }
};

const checkConfiguration = (): void => {
  const errors: Array<string> = [];
  if (!config.port) {
    errors.push('config.port');
  }
  if (errors.length) {
    throw (errors);
  }
};

export { start };
