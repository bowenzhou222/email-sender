import { config } from '../../config';
import { ISendEmailReponse, ServiceName } from 'email';
import { OptionsWithUri } from 'request-promise';
import { requestAgent } from '../../utils/request';

const mailgunConfig = {
  hostname: `${config.mailgun.protocol}://${config.mailgun.host}`,
  timeout: Number(config.mailgun.timeout),
  apiKey: config.mailgun.api_key,
  version: config.mailgun.version,
  domainName: config.mailgun.domain_name,
};
const sendgridConfig = {
  hostname: `${config.sendgrid.protocol}://${config.sendgrid.host}`,
  version: config.sendgrid.version,
  timeout: Number(config.sendgrid.timeout),
  apiKey: config.sendgrid.api_key,
};

const generateRequestOpts = (
  url: string, method: string, service: ServiceName, body?: any,
): OptionsWithUri => {
  const auth = service === 'mailgun'
    ? `Basic ${Buffer.from(`api:${mailgunConfig.apiKey}`).toString('base64')}`
    : `Bearer ${sendgridConfig.apiKey}`;
  let options = {
    headers: {
      'Authorization': auth,
      'Content-Type': 'application/json',
    },
    method,
    uri: url,
    json: true,
    timeout: mailgunConfig.timeout,
  };
  if (method === 'POST' || method === 'PUT') {
    options = Object.assign({}, options, {
      body: JSON.stringify(body),
    });
  }
  return options;
};

export const sendEmail = (emailContent: any, service: ServiceName): Promise<ISendEmailReponse> => {
  const url = service === 'mailgun'
    ? `${mailgunConfig.hostname}/${mailgunConfig.version}/${mailgunConfig.domainName}/messages`
    : `${sendgridConfig.hostname}/${sendgridConfig.version}/mail/send`;
  const options: OptionsWithUri = generateRequestOpts(url, 'POST', service, emailContent);
  return requestAgent(options, 'mailgun');
};
