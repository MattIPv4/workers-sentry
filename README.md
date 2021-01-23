# workers-sentry

Some wrappers for using Sentry in Workers.

Allows for source maps to be correctly uploaded to Sentry for your Workers, and for Sentry to be used in the Worker for error reporting.

## Webpack config

```js
const WorkersSentryWebpackPlugin = require('workers-sentry/webpack');

module.exports = {
    plugins: [
        new WorkersSentryWebpackPlugin(
            process.env.SENTRY_AUTH_TOKEN,
            process.env.SENTRY_ORG,
            process.env.SENTRY_PROJECT,
        ),
    ],
};
```
## Worker source

```js
const WorkersSentry = require('workers-sentry/worker');

const sentry = new WorkersSentry(event, process.env.SENTRY_DSN);
sentry.captureException(new Error('Hello world!'));
```

