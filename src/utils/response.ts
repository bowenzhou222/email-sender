import { Request, Response } from 'express';
import { config } from './../config';
import { ICustomFailedResponse } from 'types';

export const globalFailResponse =
  (error: string, message: string, status: number, req: Request): ICustomFailedResponse => {
  return {
    status_code: status || 400,
    error,
    message,
    meta: {
      api_version: config.app_version,
      trace_id: (req.headers.traceId as string) || '',
    },
  };
};

export const sendSuccessResponse =
  (res: Response, data: any, status: number, req: Request): Promise<Response> => {
  return Promise.resolve()
  .then(() => {
    return res.status(status).json({
      status_code: status || 200,
      meta: {
        app_version: config.app_version,
        trace_id: req.headers.traceId,
      },
      data,
    });
  })
  .catch((error: any) => {
    return res.status(500).json(globalFailResponse('Internal Error', '500 - Internal Error', 500, req));
  });
};

export const sendFailResponse =
  (res: Response, error: string, message: string, status: number, req: Request): Promise<Response> => {
  return Promise.resolve()
  .then(() => {
    return res.status(status).json(globalFailResponse(error, message, status, req));
  })
  .catch((err: any) => {
    return res.status(500).json(globalFailResponse('Internal Error', '500 - Internal Error', 500, req));
  });
};
