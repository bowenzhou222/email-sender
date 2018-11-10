import * as _ from 'lodash';
import { Request, Response, NextFunction } from 'express';
import { validateEmail, sendValidationErrorOrNext } from '../../utils/validations';
import { IEmailTo, IEmailCC, IEmailBCC } from 'email';

const validateArrayOfEmails = (emails: any): boolean => {
  if (!_.isArray(emails)) {
    return false;
  }
  return emails.every((email: IEmailTo | IEmailCC | IEmailBCC) => {
    return !!email.email && validateEmail(email.email);
  });
};

export const validateSendEmail = (
  req: Request, res: Response, next: NextFunction,
): Promise<Response> | void => {
  req.checkBody({
    from: {
      custom: { options: (fromEmail: string): boolean => validateEmail(fromEmail) },
      errorMessage: 'From email is invalid',
    },
    to: {
      custom: {
        options: (toEmails: Array<any>): boolean => validateArrayOfEmails(toEmails),
      },
      errorMessage: 'Recipient emails are invalid',
    },
    cc: {
      optional: true,
      custom: {
        options: (ccEmails: Array<any>): boolean => validateArrayOfEmails(ccEmails),
      },
      errorMessage: 'CC emails are Invalid',
    },
    bcc: {
      optional: true,
      custom: {
        options: (bccEmails: Array<any>): boolean => validateArrayOfEmails(bccEmails),
      },
      errorMessage: 'BCC emails are Invalid',
    },
    subject: {
      notEmpty: true,
      optional: false,
      errorMessage: 'Please provide subject',
    },
    text: {
      notEmpty: true,
      optional: false,
      errorMessage: 'Please provide email content',
    },
  });
  return sendValidationErrorOrNext(req, res, next);
};
