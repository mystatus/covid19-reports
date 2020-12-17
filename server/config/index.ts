import devConfig from './development';
import prodConfig from './production';
import testConfig from './test';

const baseConfig = {
  // Local vs AWS Kibana
  ror: {
    secret: process.env.ROR_JWT_SIGNATURE_KEY || 'woEayHiICafruph^gZJb3EG5Fnl1qou6XUT8xR^7OMwaCYxz^&@rr#Hi5*s*918tQS&iDJO&67xy0hP!F@pThb3#Aymx%XPV3x^',
  },

  kibana: {
    // App basepath: make sure your kibana.yml file isn't using the app root or it will mess up the proxy.
    basePath: process.env.KIBANA_BASEPATH || '/_plugin/kibana',
    uri: process.env.KIBANA_URI || 'http://localhost:5601',
  },

  elasticsearch: {
    host: process.env.ELASTICSEARCH_URI || 'localhost:9200',
    httpAuth: (process.env.ELASTICSEARCH_USER && process.env.ELASTICSEARCH_PASSWORD) ? `${process.env.ELASTICSEARCH_USER}:${process.env.ELASTICSEARCH_PASSWORD}` : 'kibana:kibana',
    apiVersion: process.env.ELASTICSEARCH_API_VERSION || '6.4',
  },

  dynamo: {
    symptomTable: process.env.SYMPTOMTABLE || 'dds-phase1-COVID-19-Symptoms',
    symptomIndex: process.env.SYMPTOMINDEX || 'EDIPI-Timestamp-index',
    symptomLambda: process.env.SYMPTOMFUNC || 'symptom_message_handler'
  }
};

// Merge current environment config.
let config: Config = baseConfig;
if (process.env.NODE_ENV === 'development') {
  config = {
    ...config,
    ...devConfig,
  };
} else if (process.env.NODE_ENV === 'production') {
  config = {
    ...config,
    ...prodConfig,
  };
} else if (process.env.NODE_ENV === 'test') {
  config = {
    ...config,
    ...testConfig,
  };
}

type Config = typeof baseConfig
  & Partial<typeof devConfig>
  & Partial<typeof prodConfig>
  & Partial<typeof testConfig>;

const configExport = config;

export default configExport;
