declare namespace email {
  interface IEmailTo {
    email: string;
    name?: string;
  }
  
  interface IEmailCC {
    email: string;
    name?: string;
  }
  
  interface IEmailBCC {
    email: string;
    name?: string;
  }
  interface IEmailRequestBody {
    from: string;
    to: Array<IEmailTo>;
    cc?: Array<IEmailCC>;
    bcc?: Array<IEmailBCC>;
    subject: string;
    text: string;
  }
  
  interface IMailgunEmailContent {
    from: string;
    to: string;
    cc?: string;
    bcc?: string;
    subject: string;
    text: string;
  }
  
  interface IEmailPersonalization {
    subject: string;
    to: Array<IEmailTo>;
    cc?: Array<IEmailCC>;
    bcc?: Array<IEmailBCC>;
  }
  
  interface IEmailContent {
    type: 'text/plain' | 'text/html';
    value: string;
  }
  interface ISendgridEmailContent {
    from: {
      email: string,
      name?: string,
    };
    personalizations: Array<IEmailPersonalization>;
    content: Array<IEmailContent>;
  }

  interface IMailgunResponse {
    id: string;
    message: string;
  }

  interface ISendgridResponse {}
  
  type ISendEmailReponse = IMailgunResponse | ISendgridResponse;
  
  type ServiceName = 'mailgun' | 'sendgrid';
}

export = email;