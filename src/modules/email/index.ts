import * as express from 'express';

import * as controller from './controller';
import { validateSendEmail } from './validations';

const Email = express();

Email.post('/email', validateSendEmail, controller.send);

export { Email };
