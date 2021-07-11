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

const handleRequest = async request => {
    // Do some stuff

    // Oh no, an error!
    throw new Error('Hello world!');
};

const handleScheduled = async () => {
    // Do some stuff

    // Oh no, an error!
    throw new Error('Hello world!');
};

addEventListener('fetch', event => {
    // Start Sentry
    const sentry = new WorkersSentry(event, process.env.SENTRY_DSN);

    // Process the event
    return event.respondWith(handleRequest(event.request)).catch(err => {
        sentry.captureException(err);
        throw err;
    });
});

addEventListener('scheduled', event => {
    // Start Sentry
    const sentry = new WorkersSentry(event, process.env.SENTRY_DSN);

    // Process the event
    return event.waitUntil(handleScheduled()).catch(err => {
        sentry.captureException(err);
        throw err;
    });
});
```

