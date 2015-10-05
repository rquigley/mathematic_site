var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        app: './website/static/js-src/main.js',
        vendor: ['jquery', 'memphis', 'velocity-animate'],
    },
    output: {
        path: path.join(__dirname, 'website/static/gen/js/'),
        filename: 'bundle.js',
    },
    resolve: {
        modulesDirectories: ['node_modules'],
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel-loader' },
        ],
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
        new webpack.ProvidePlugin({
            '$': 'jquery',
            'jQuery': 'jquery',
            'window.jQuery': 'jquery',
        }),
        new webpack.ProvidePlugin({
            Promise: 'es6-promise',
        }),
    ],
    devtool: 'inline-source-map'
};

