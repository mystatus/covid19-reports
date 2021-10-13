import { env } from '../util/env';
import devConfig from './development';
import prodConfig from './production';
import testConfig from './test';

const baseConfig = {
  dynamo: {
    symptomTable: process.env.DYNAMO_SYMPTOM_TABLE || 'dds-phase1-COVID-19-Symptoms',
    symptomIndex: process.env.DYNAMO_SYMPTOM_INDEX || 'EDIPI-Timestamp-index',
    symptomLambda: process.env.DYNAMO_SYMPTOM_LAMBDA || 'symptom_message_handler',
  },

  links: {
    onboarding: process.env.ONBOARDING_LINK || 'https://dev.welcome.statusengine.mystatus.mil/CustomerOnboarding.pdf',
  },
};

// Merge current environment config.
let config: Config = baseConfig;
if (env.isDev) {
  config = {
    ...config,
    ...devConfig,
  };
} else if (env.isProd) {
  config = {
    ...config,
    ...prodConfig,
  };
} else if (env.isTest) {
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
