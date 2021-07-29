const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  webpack: {
    configure: webpackConfig => {
      // Remove the ModuleScopePlugin which throws when we try
      // to import something outside of src/.
      webpackConfig.resolve.plugins.pop();

      // Resolve the path aliases.
      webpackConfig.resolve.plugins.push(new TsconfigPathsPlugin());

      // Let Babel compile outside of src/.
      const oneOfRule = webpackConfig.module.rules.find(rule => rule.oneOf);
      const tsRule = oneOfRule.oneOf.find(rule => rule.test.toString().includes('ts|tsx'));
      tsRule.include = undefined;
      tsRule.exclude = /node_modules/;

      return webpackConfig;
    },
  },
};
