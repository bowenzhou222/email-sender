import * as express from 'express';
import { Health } from './modules/health';
import { Email } from './modules/email';

const route = express.Router();

route.use(
  Health,
  Email,
);

export { route };
