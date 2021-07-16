const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  // babel: {
  //   plugins: ['babel-plugin-transform-typescript-metadata'],
  // },
  webpack: {
    // alias: {
    //   '@covid19-reports/*': ['../*/src'],
    // },
    plugins: {
      add: [new TsconfigPathsPlugin()],
      remove: ['ModuleScopePlugin'],
    },
  },
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          const oneOfRule = webpackConfig.module.rules.find(rule => rule.oneOf);
          if (oneOfRule) {
            const tsRule = oneOfRule.oneOf.find(rule => rule.test.toString().includes('ts|tsx'));
            tsRule.include = undefined;
            tsRule.exclude = /node_modules/;

            // const newIncludePaths = [
            //   // relative path to my yarn workspace library
            //   path.resolve(__dirname, '../shared/'),
            // ];
            //
            // if (tsxRule) {
            //   if (Array.isArray(tsxRule.include)) {
            //     tsxRule.include = [...tsxRule.include, ...newIncludePaths];
            //   } else {
            //     tsxRule.include = [tsxRule.include, ...newIncludePaths];
            //   }
            // }
          }

          return webpackConfig;
        },
      },
    },
  ],
};
