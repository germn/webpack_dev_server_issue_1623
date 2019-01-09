const merge = require('webpack-merge');


module.exports = env => {
    const static_root = '//localhost:9001/static/';
    const host = 'localhost';
    const port = 9001;
    const reload = false;


    const common = require('./common.js')();
    return merge(common, {
        mode: 'development',
        output: {
            publicPath: static_root,
        },
        devtool: 'cheap-module-eval-source-map',
        devServer: {
            host: host,
            port: port,
            https: false,

            hot: false,
            inline: reload,

            compress: true,

            stats: {
                all: false,
                assets: true,
                errors: true,
                moduleTrace: true,
                colors: false
            },
        }
    });
};