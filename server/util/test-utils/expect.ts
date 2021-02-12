import { AxiosResponse } from 'axios';
import { expect } from 'chai';
import util from 'util';

export const expectNoErrors = (res: AxiosResponse) => {
  expect(res.data, util.inspect(res.data, { depth: 4 })).not.to.have.property('errors');
};
