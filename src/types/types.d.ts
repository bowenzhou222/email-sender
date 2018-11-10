import { Request } from 'express';
import { RequestValidation } from 'express-validator';

export interface ICustomFailedResponse {
  status_code: number;
  error: string;
  message: string;
  meta: {
    api_version: string;
    trace_id: string;
  };
}

declare global {
  namespace Express {
    interface Request extends ExpressValidator.RequestValidation { }
  }
}
