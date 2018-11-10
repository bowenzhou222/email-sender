import * as c from 'chance';

const chance = c.Chance(Math.random);

const testFromEmail = `test_${chance.string({ alpha: true }).toLowerCase()}@siteminder.com`;
const testToEmailOne = `test_${chance.string({ alpha: true }).toLowerCase()}@siteminder.com`;
const testToEmailTwo = `test_${chance.string({ alpha: true }).toLowerCase()}@siteminder.com`;
const testEmailSubject = `test_${chance.string({ alpha: true }).toLowerCase()}`;
const testEmailContent = `test_${chance.string({ alpha: true }).toLowerCase()}`;

export const validEmailAddress = `test_${chance.string({ alpha: true }).toLowerCase()}@siteminder.com`;
export const invalidEmailAddress = 'invalid email address';

export const testEmailPayload = {
  from: testFromEmail,
  to: [
    {
      email: testToEmailOne,
    },
    {
      email: testToEmailTwo,
    },
  ],
  subject: testEmailSubject,
  text: testEmailContent,
};

export const testMailgunEmailContent = {
  from: testFromEmail,
  to: `${testToEmailOne},${testToEmailTwo}`,
  subject: testEmailSubject,
  text: testEmailContent,
};

export const testSendgridEmailContent = {
  from: {
    email: testFromEmail,
  },
  personalizations: [
    {
      subject: testEmailSubject,
      to:
        [
          { email: testToEmailOne },
          { email: testToEmailTwo },
        ],
    },
  ],
  content: [
    {
      type: 'text/plain',
      value: testEmailContent,
    },
  ],
  cc: undefined,
  bcc: undefined,
};
