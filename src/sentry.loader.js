var javascriptStringify = require('javascript-stringify');

module.exports = function sentryLoader(content, map, meta) {
  const { releasePromise, ravenConfig } = this.query;
  const callback = this.async();
  releasePromise.then(version => {
    const newVersion = version;
    let sentryRelease = `global.SENTRY_RELEASE={};\nglobal.SENTRY_RELEASE.id="${newVersion}";`;
    if (ravenConfig) {
      const dsn = JSON.stringify(ravenConfig.dsn);
      sentryRelease += `\nvar R=require("raven-js");\nR.config(${dsn}, ${javascriptStringify(ravenConfig)}).install();`
    }
    callback(null, sentryRelease, map, meta);
  });
};
