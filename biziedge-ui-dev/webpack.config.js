const createExpoWebpackConfigAsync = require("@expo/webpack-config");

// Expo CLI will await this method so you can optionally return a promise.
module.exports = async function (env, argv) {
  const webpackConfig = await createExpoWebpackConfigAsync(env, argv);

  //   webpackConfig.exclude = /node_modules/; // THAT IS THE IMPORTANT LINE

  // Maybe you want to turn off compression in dev mode.
  if (webpackConfig.mode === "development") {
    webpackConfig.devServer.compress = false;
  }

  // Or prevent minimizing the bundle when you build.
  if (webpackConfig.mode === "production") {
    webpackConfig.optimization.minimize = false;
  }

  // Finally return the new config for the CLI to use.
  return webpackConfig;
};
