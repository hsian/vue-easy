const webpackComponent = require("./webpack.component");
const { merge } = require("webpack-merge");
const nodeExternals = require('webpack-node-externals');
const path = require("path");
const _ = require("lodash");
const cwd = process.cwd();
const webpackConfig = _.cloneDeep(webpackComponent);

webpackConfig.module.rules = webpackConfig.module.rules.filter(function(item, i){
    const isExist = [".css", ".less"].some((v) => {
        return item.test.toString().indexOf(v) > -1;
    });
    
    return !isExist;
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
            {
                test: /\.less$/,
                use: [{
                    loader: "css-loader",
                },
                {
                    loader: 'less-loader',
                }]  
            },
        ]
    }
})
