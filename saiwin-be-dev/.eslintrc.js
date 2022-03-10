module.exports = {
  env: {
    browser: true,
    commonjs: true,
  },
  parserOptions: {
    ecmaVersion: 6,
  },
  extends: "eslint:recommended",
  rules: {
    "linebreak-style": ["error", "unix"],
  },
};
