const Toucan = require('toucan-js').default;

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
            release: SENTRY_RELEASE && SENTRY_RELEASE.id,
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

module.exports = Sentry;
