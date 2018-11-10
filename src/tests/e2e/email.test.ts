import * as chai from 'chai';
import { expect } from 'chai';
import chaiHttp = require('chai-http');
import * as nock from 'nock';
import * as _ from 'lodash';

import { app } from '../../server';
import {
  testEmailPayload, testMailgunEmailContent, testSendgridEmailContent, validEmailAddress, invalidEmailAddress,
} from '../mock/email';
import { mailgunConfig, sendgridConfig } from '../../modules/email/client';
import * as queryString from 'query-string';

chai.use(chaiHttp);

describe('Email service', () => {
  beforeEach(() => {
    nock(mailgunConfig.hostname, {
      reqheaders: {
        'authorization': `Basic ${Buffer.from(`api:${mailgunConfig.apiKey}`).toString('base64')}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
    })
      .post(
        `/${mailgunConfig.version}/${mailgunConfig.domainName}/messages`,
        queryString.stringify(testMailgunEmailContent),
      )
      .reply(200, {});

    nock(sendgridConfig.hostname, {
      reqheaders: {
        'Authorization': `Bearer ${sendgridConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
    })
      .post(
        `/${sendgridConfig.version}/mail/send`,
        testSendgridEmailContent,
      )
      .reply(200, {});
  });
  it('Send email successfully', () => {
    return chai.request(app)
      .post('/email')
      .send(testEmailPayload)
      .then((res: ChaiHttp.Response) => {
        expect(res.status).to.equal(200);
      });
  });

  it('Send email successfully via sendgrid when mailgun fails', () => {
    nock(mailgunConfig.hostname, {
      reqheaders: {
        'authorization': `Basic ${Buffer.from(`api:${mailgunConfig.apiKey}`).toString('base64')}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
    })
      .post(
        `/${mailgunConfig.version}/${mailgunConfig.domainName}/messages`,
        queryString.stringify(testMailgunEmailContent),
      )
      .replyWithError('mock error');

    return chai.request(app)
      .post('/email')
      .send(testEmailPayload)
      .then((res: ChaiHttp.Response) => {
        expect(res.status).to.equal(200);
      });
  });

  it('Validations fail because of from email', () => {
    const emailPayloadWithoutFrom = _.omit(testEmailPayload, ['from']);
    return chai.request(app)
      .post('/email')
      .send(emailPayloadWithoutFrom)
      .then((res: ChaiHttp.Response) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('Bad Request');
        expect(res.body.message).to.equal('From email is invalid');
      });
  });

  it('Validations fail because of no from email', () => {
    const emailPayloadWithoutFrom = _.omit(testEmailPayload, ['from']);
    return chai.request(app)
      .post('/email')
      .send(emailPayloadWithoutFrom)
      .then((res: ChaiHttp.Response) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('Bad Request');
        expect(res.body.message).to.equal('From email is invalid');
      });
  });

  it('Validations fail because of no to emails', () => {
    const emailPayloadWithoutToEmails = _.omit(testEmailPayload, ['to']);
    return chai.request(app)
      .post('/email')
      .send(emailPayloadWithoutToEmails)
      .then((res: ChaiHttp.Response) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('Bad Request');
        expect(res.body.message).to.equal('Recipient emails are invalid');
      });
  });

  it('Validations fail because of invalid to emails', () => {
    const emailPayloadWithInvalidToEmails = {
      ..._.omit(testEmailPayload, ['from']),
      to: [
        {
          email: validEmailAddress,
        },
        {
          email: invalidEmailAddress,
        },
      ],
    };
    return chai.request(app)
      .post('/email')
      .send(emailPayloadWithInvalidToEmails)
      .then((res: ChaiHttp.Response) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('Bad Request');
        expect(res.body.message).to.equal('From email is invalid');
      });
  });

  it('Validations fail because of no subject', () => {
    const emailPayloadWithoutSubject = _.omit(testEmailPayload, ['subject']);
    return chai.request(app)
      .post('/email')
      .send(emailPayloadWithoutSubject)
      .then((res: ChaiHttp.Response) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('Bad Request');
        expect(res.body.message).to.equal('Please provide subject');
      });
  });

  it('Validations fail because of no content', () => {
    const emailPayloadWithoutContent = _.omit(testEmailPayload, ['text']);
    return chai.request(app)
      .post('/email')
      .send(emailPayloadWithoutContent)
      .then((res: ChaiHttp.Response) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('Bad Request');
        expect(res.body.message).to.equal('Please provide email content');
      });
  });
});
