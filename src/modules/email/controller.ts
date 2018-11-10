import { Request, Response, NextFunction } from 'express';
import { StatusCodeError } from 'request-promise/errors';

import * as client from './client';
import { logger } from '../../utils/log';
import { sendSuccessResponse, sendFailResponse } from '../../utils/response';
import {
  ServiceName, ISendEmailReponse, IEmailRequestBody, IMailgunEmailContent, IEmailTo, IEmailCC, IEmailBCC,
  ISendgridEmailContent,
} from 'email';

export const send = (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  const { body }: { body: IEmailRequestBody} = req;
  const { traceId } = req.headers;
  const mailgunBody: IMailgunEmailContent = {
    from: body.from,
    to: body.to.map((t: IEmailTo) => t.email).join(','),
    cc: body.cc.map((t: IEmailCC) => t.email).join(','),
    bcc: body.bcc.map((t: IEmailBCC) => t.email).join(','),
    subject: body.subject,
    text: body.text,
  };
  return sendEmail('mailgun', mailgunBody, traceId as string)
    .then((emailResponse: ISendEmailReponse) => {
      return sendSuccessResponse(res, emailResponse, 200, req);
    })
    .catch((error: StatusCodeError) => {
      const sendgridBody: ISendgridEmailContent = {
        from: body.from,
        personalizations: [{
          subject: body.subject,
          to: body.to,
          cc: body.cc,
          bcc: body.bcc,
        }],
        content: [{
          type: 'text/plain',
          value: body.text,
        }],
      };
      return sendEmail('sendgrid', sendgridBody, traceId as string)
      .then((emailResponse: ISendEmailReponse) => {
        return sendSuccessResponse(res, emailResponse, 200, req);
      })
      .catch((err: StatusCodeError) => {
        logger(
          'error',
          `Send email failed - traceId: ${traceId}, ${error.message}`,
        );
        return sendFailResponse(res, err.name, err.message, err.statusCode, req);
      });
    });
};

const sendEmail = (service: ServiceName, body: IMailgunEmailContent | ISendgridEmailContent, traceId: string):
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
        `Send email via ${service} failed - traceId: ${traceId}, ${error.message}`,
      );
      return Promise.reject(error);
    });
};
