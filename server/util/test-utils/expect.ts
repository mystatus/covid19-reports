import { AxiosResponse } from 'axios';
import { expect } from 'chai';
import util from 'util';

export const expectNoErrors = (res: AxiosResponse) => {
  expect(res.data, util.inspect(res.data, { depth: 4 })).not.to.have.property('errors');
};

export const expectError = (res: AxiosResponse, error: string) => {
  expect(res.data, util.inspect(res.data, { depth: 4 })).to.have.property('errors');
  expect(res.data.errors).to.have.lengthOf(1);
  expect(res.data.errors[0]).to.have.property('message');
  expect(res.data.errors[0].message).to.have.string(error);
};
