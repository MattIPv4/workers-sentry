const SentryWebpackPlugin = require('@sentry/webpack-plugin');

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

    apply(compiler) {
        super.apply(compiler);

        // Ensure source maps are enabled
        compiler.options.devtool = 'source-map';
    }
}

module.exports = WebpackPlugin;
