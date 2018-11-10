import * as express from 'express';
import { appMiddlewares, tracer } from './middleware';
import { expressMiddleware as zipkinMiddleware } from 'zipkin-instrumentation-express';
import { start } from './utils/start';
import { route } from './routes';

export const app = express();

app.use(appMiddlewares);
if (!!tracer) {
  app.use(/\/((?!health).)*/, zipkinMiddleware({tracer}));
}
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!!tracer) {
    tracer.setId(tracer.id);
    req.headers.traceId = tracer.id.traceId;
  }
  return next();
});

app.use(route);

start(app);
