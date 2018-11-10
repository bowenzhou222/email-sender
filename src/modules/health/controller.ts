import { Request, Response } from 'express';
import { sendSuccessResponse } from '../../utils/response';
import { logger } from '../../utils/log';

export const healthCheck = (req: Request, res: Response): Promise<Response> => {
  logger('info', `Health check success - ${req.headers.traceId}`);
  return sendSuccessResponse(res, { status: 'OK' }, 200, req);
};
