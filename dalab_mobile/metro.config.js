const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const path = require('path');

const {
  withSentryConfig
} = require("@sentry/react-native/metro");

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  watchFolders: [
    path.resolve(__dirname, '../packages'),
    path.resolve(__dirname, '../node_modules'),
  ],
  resolver: {
    blockList: exclusionList([
      /.*\/android\/\.gradle\/.*/,
      /.*\/android\/app\/\.cxx\/.*/,
      /.*\/android\/app\/build\/.*/,
      /.*\/android\/build\/.*/,
      /.*\/ios\/Pods\/.*/,
      /.*\/ios\/build\/.*/,
      /.*\/dalab_web\/.*/,
      /.*\/dalabapp\/.*/,
    ]),
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, '../node_modules'),
    ],
    extraNodeModules: new Proxy(
      {},
      {
        get: (_, name) => path.join(__dirname, '../node_modules', name),
      },
    ),
    unstable_enablePackageExports: true,
  },
};

module.exports = withSentryConfig(mergeConfig(getDefaultConfig(__dirname), config));
