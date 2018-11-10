import * as chai from 'chai';
import { expect } from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../../server';

chai.use(chaiHttp);

describe('Health check', () => {
  it('Health check success', () => {
    return chai.request(app)
      .get('/health')
      .then((res: ChaiHttp.Response) => {
        expect(res.status).to.equal(200);
        expect(res.body.status_code).to.equal(200);
        expect(res.body.data).to.deep.equal({
          status: 'OK',
        });
      });
  });
});
