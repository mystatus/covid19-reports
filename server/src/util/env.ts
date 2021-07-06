import process from 'process';

export const env = {

  get isProd() {
    return process.env.NODE_ENV === 'production';
  },

  get isDev() {
    return process.env.NODE_ENV === 'development';
  },

  get isTest() {
    return process.env.NODE_ENV === 'test';
  },

};
