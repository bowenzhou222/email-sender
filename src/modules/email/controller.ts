import { Request, Response, NextFunction } from 'express';
import { StatusCodeError } from 'request-promise/errors';

import * as client from './client';
import { logger } from '../../utils/log';
import { ServiceName, ISendEmailReponse } from 'email';
import { sendSuccessResponse, sendFailResponse } from '../../utils/response';

export const send = (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  const { body } = req;
  const { traceId } = req.headers;
  return sendEmail('mailgun', body, traceId as string)
    .then((emailResponse: ISendEmailReponse) => {
      return sendSuccessResponse(res, emailResponse, 200, req);
    })
    .catch((error: StatusCodeError) => {
      return sendEmail('sendgrid', body, traceId as string)
      .then((emailResponse: ISendEmailReponse) => {
        return sendSuccessResponse(res, emailResponse, 200, req);
      })
      .catch((err: StatusCodeError) => {
        logger(
          'error',
          `Send email failed - traceId: ${traceId}, ${JSON.stringify(error.message)}`,
        );
        return sendFailResponse(res, err.name, err.message, err.statusCode, req);
      });
    });
};

const sendEmail = (service: ServiceName, body: any, traceId: string):
  Promise<ISendEmailReponse | StatusCodeError> => {
  return client.sendEmail(body, service)
    .then((emailResponse: ISendEmailReponse) => {
      logger(
        'info',
        `Send email via ${service} success - traceId: ${traceId}, ${
          JSON.stringify(emailResponse)}`,
      );
      return Promise.resolve(emailResponse);
    })
    .catch((error: StatusCodeError) => {
      logger(
        'error',
        `Send email via ${service} failed - traceId: ${traceId}, ${
          JSON.stringify(error.message)}`,
      );
      return Promise.reject(error);
    });
};
