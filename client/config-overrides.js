const webpack = require('webpack');

module.exports = function override(config) {
    config.ignoreWarnings = [/Failed to parse source map/];

    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        "fs": false,
        "tls": false,
        "net": false,
        "path": false,
        "zlib": false,
        "http": false,
        "https": false,
        "stream": false,
        "crypto": false,
        "crypto-browserify": false
    })
    config.resolve.fallback = fallback;
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer']
        })
    ])
    return config;
}