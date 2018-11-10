const throng = require('throng');

const WORKERS = process.env.WEB_CONCURRENCY || 4;
const startMaster = (id) => {
  console.log(`----------------- Started master ${id} -----------------`);
};

const startWorker = (id) => {
  try {
    require('./dist/server.js');
    console.log(`----------------- Started worker ${id} -----------------`);
    process.on('SIGTERM', () => {
      console.error(`----------------- Worker ${id} exiting... -----------------`);
      process.exit();
    });
  } catch {
    console.error(`----------------- Fail to start worker ${id} -----------------`);
  }
};

throng({
  workers: WORKERS,
  master: startMaster,
  start: startWorker,
});
