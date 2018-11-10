import * as cors from 'cors';
import * as helmet from 'helmet';
import * as bodyParser from 'body-parser';
import * as expressValidator from 'express-validator';
import { RequestHandler } from 'express';

import { Tracer, jsonEncoder, BatchRecorder } from 'zipkin';
import CLSContext = require('zipkin-context-cls');
import { HttpLogger } from 'zipkin-transport-http';
import { config } from './config';

export const appMiddlewares: Array<RequestHandler> = [
  cors(),
  helmet(),
  bodyParser.urlencoded({ extended: true }),
  bodyParser.json(),
  expressValidator(),
];

let tracer: Tracer | undefined;
if (config.zipkin.endpoint) {
  tracer = new Tracer({
    ctxImpl: new CLSContext('zipkin'),
    recorder: new BatchRecorder({
      logger: new HttpLogger({
        endpoint: config.zipkin.endpoint,
        jsonEncoder: jsonEncoder.JSON_V2,
      }),
    }),
    localServiceName: config.zipkin.app_name,
  });
}
export { tracer };
