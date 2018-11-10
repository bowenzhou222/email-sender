import * as express from 'express';
import * as controller from './controller';

const Health = express();

Health.get('/health', controller.healthCheck);

export { Health };
