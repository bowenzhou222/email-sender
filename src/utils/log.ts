import { config } from '../config';
import * as winston from 'winston';
import { createLogger, format } from 'winston';
import { TransformableInfo } from 'logform';

const winstonLogger: winston.Logger = createLogger({
  format: format.printf((info: TransformableInfo) => {
    return `${JSON.stringify({
      level: info.level,
      message: info.message,
      app_version: config.app_version,
      app_name: config.app_name,
    })}`;
  }),
  transports: new winston.transports.Console(),
});
const logger = (level: string, message: string): void => {
  winstonLogger.log({
    level,
    message,
  });
};

export { logger };
