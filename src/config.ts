import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  app_version: '1.0.0',
  port: process.env.PORT || '9090',
  app_name: 'siteminder-email',
  zipkin: {
    app_name: process.env.ZIPKIN_APP_NAME || 'siteminder-email',
    endpoint: process.env.ZIPKIN_ENDPOINT || 'http://localhost:9411/api/v2/spans',
  },
  mailgun: {
    protocol: process.env.MAILGUN_PROTOCOL || 'https',
    host: process.env.MAILGUN_HOST || 'api.mailgun.net',
    domain_name: process.env.MAILGUN_DOMAIN_NAME || 'sandbox018225051754486dac08e65225831082.mailgun.org',
    version: process.env.MAILGUN_VERSION || 'v3',
    timeout: process.env.MAILGUN_TIMEOUT || '3000',
    api_key: process.env.MAILGUN_API_KEY || 'key-4ba62a3bddb3d4369784ab95f9a56810',
  },
  sendgrid: {
    protocol: process.env.SENDGRID_PROTOCOL || 'https',
    host: process.env.SENDGRID_HOST || 'api.sendgrid.com',
    version: process.env.SENDGRID_VERSION || 'v3',
    timeout: process.env.SENDGRID_TIMEOUT || '3000',
    api_key: process.env.SENDGRID_API_KEY || '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',
  },
};
