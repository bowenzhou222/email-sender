
import * as rp from 'request-promise';
import wrapRequest = require('zipkin-instrumentation-request');
import { tracer } from '../middleware';

export const requestAgent = (options: rp.OptionsWithUri, zipkinRemoteServiceName: string): Promise<any> => {
  let zipkinRequest = rp;
  if (!!tracer) {
    zipkinRequest = wrapRequest(rp, {
      tracer,
      remoteServiceName: zipkinRemoteServiceName,
    });
  }
  return Promise.resolve(zipkinRequest(options));
};
