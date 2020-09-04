const webpackComponent = require("./webpack.component");
const { merge } = require("webpack-merge");
const nodeExternals = require('webpack-node-externals');
const path = require("path");
const _ = require("lodash");
const cwd = process.cwd();

const webpackConfig = _.cloneDeep(webpackComponent);
webpackConfig.module.rules.forEach(function(item, i){
    if([".css"].some((v) => item.test.toString().indexOf(v) > -1)){
        webpackConfig.module.rules.splice(i, 1);
    }
})


module.exports = merge(webpackConfig, {
    output: {
        path: path.resolve(process.cwd(), './lib/components'),
        publicPath: '/lib/',
        filename: '[name].js',
        chunkFilename: '[id].js',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader'] 
            },
        ]
    }
})
