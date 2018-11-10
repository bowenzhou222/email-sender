import * as throng from 'throng';

import { logger } from './src/utils/log';

const WORKERS = process.env.WEB_CONCURRENCY || 4;
const startMaster = (id: number): any => {
  logger('info', `----------------- Started master ${id} -----------------`);
};

const startWorker = (id: number): any => {
  require('./dist/server.js');
  logger('info', `----------------- Started worker ${id} -----------------`);
  process.on('SIGTERM', () => {
    logger('error', `----------------- Worker ${id} exiting... -----------------`);
    process.exit();
  });
};

throng({
  workers: WORKERS,
  master: startMaster,
  start: startWorker,
});
