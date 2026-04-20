const CracoLessPlugin = require('craco-less');

const disableAntdSourceMaps = (webpackConfig) => {
  const sourceMapRule = webpackConfig.module.rules.find(
    (rule) =>
      rule.enforce === 'pre' &&
      Array.isArray(rule.use) &&
      rule.use.some((useEntry) =>
        String(useEntry.loader).includes('source-map-loader'),
      ),
  );

  if (sourceMapRule) {
    sourceMapRule.exclude = [
      ...(sourceMapRule.exclude || []),
      /node_modules[\\/]antd[\\/]/,
    ];
  }

  webpackConfig.ignoreWarnings = [
    ...(webpackConfig.ignoreWarnings || []),
    /antd[\\/]dist[\\/]antd\.css/,
  ];

  return webpackConfig;
};

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            // modifyVars: { '@primary-color': '#1DA57A' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  webpack: {
    configure: (webpackConfig) => {
      disableAntdSourceMaps(webpackConfig);
      // This checkout is missing many optional modules; full-project typecheck fails.
      webpackConfig.plugins = (webpackConfig.plugins || []).filter(
        (plugin) =>
          plugin &&
          plugin.constructor &&
          plugin.constructor.name !== 'ForkTsCheckerWebpackPlugin',
      );
      return webpackConfig;
    },
  },
};