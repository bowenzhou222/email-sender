import * as express from 'express';

import * as controller from './controller';

const Email = express();

Email.post('/email', controller.send);

export { Email };
