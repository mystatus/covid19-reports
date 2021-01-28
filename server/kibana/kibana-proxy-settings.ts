import { ClientRequest, IncomingMessage } from 'http';
import { Config } from 'http-proxy-middleware';
import { ApiRequest } from '../api';
import config from '../config';

const kibanaProxyConfig: Config = {
  target: config.kibana.uri,
  changeOrigin: true,
  logLevel: 'warn',
  secure: false,

  // Strip out the appPath, so kibana sees requested path
  pathRewrite: (path: string) => {
    return path.replace(`${config.kibana.basePath}`, '');
  },

  // add custom headers to request
  onProxyReq: (proxyReq: ClientRequest, req: ProxyRequest) => {
    if (req.appUserRole) {
      proxyReq.setHeader('x-se-fire-department-all', req.appUserRole.getKibanaIndex());
    }
  },

  router: () => {
    return config.kibana.uri;
  },
};

type ProxyRequest = IncomingMessage & ApiRequest;

export default kibanaProxyConfig;
