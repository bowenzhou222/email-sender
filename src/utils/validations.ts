import { isEmail } from 'validator';
import * as _ from 'lodash';
import { Request, Response, NextFunction } from 'express';
import { sendFailResponse } from './response';

export const sendValidationErrorOrNext = (
  req: Request, res: Response, next: NextFunction,
): Promise<Response> | void => {
  const validationErrors = req.validationErrors();
  if (validationErrors) {
    return sendFailResponse(res, 'Bad Request', validationErrors[0].msg, 400, req);
  }
  return next();
};

export const validateEmail = (email?: string): boolean => {
  return _.isString(email) ? isEmail(email) : false;
};
