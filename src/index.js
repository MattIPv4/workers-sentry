const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const { default: Toucan } = require('toucan-js');

class WebpackPlugin extends SentryWebpackPlugin {
    constructor(token, org, project) {
        // Wrap the default Sentry plugin with Workers specific settings
        super({
            authToken: token,
            org: org,
            project: project,
            include: './dist',
            ignore: ['node_modules', 'webpack.config.js'],
        });
    }
}

// Thanks @cloudflare/worker-sentry for the base of this
class Sentry extends Toucan {
    constructor(event, dsn, opts = {}) {
        // Wrap Toucan with some better defaults
        super({
            dsn: process.env.SENTRY_DSN,
            event: event,
            allowedHeaders: [
                'user-agent',
                'cf-challenge',
                'accept-encoding',
                'accept-language',
                'cf-ray',
                'content-length',
                'content-type',
                'x-real-ip',
                'host',
            ],
            allowedSearchParams: /(.*)/,
            rewriteFrames: {
                root: '/',
            },
            ...opts,
        });

        // Get the request
        const request = event.request;

        // Determine with Cloudflare colo the req went to
        const colo = request.cf && request.cf.colo ? request.cf.colo : 'UNKNOWN';
        this.setTag('colo', colo);

        // Define the user making the req based on IP + UA + colo
        const ipAddress = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for');
        const userAgent = request.headers.get('user-agent') || '';
        this.setUser({ ip: ipAddress, userAgent, colo });
    }
}

module.exports = { WebpackPlugin, Sentry };
