import { ClientRequest, IncomingMessage } from 'http';
import { Config } from 'http-proxy-middleware';
import { ApiRequest } from '../api';
import config from '../config';
import { buildEsIndexPatternsForWorkspace } from '../util/elasticsearch-utils';

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
      const indexPatterns = buildEsIndexPatternsForWorkspace(req.appUser, req.appUserRole, req.appWorkspace!)
        .join(',');
      proxyReq.setHeader('x-se-indices', indexPatterns);
    }
  },

  router: () => {
    return config.kibana.uri;
  },
};

type ProxyRequest = IncomingMessage & ApiRequest;

export default kibanaProxyConfig;
