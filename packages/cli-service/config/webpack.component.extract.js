const webpackComponent = require("./webpack.component");
const { merge } = require("webpack-merge");
const path = require("path");
const _ = require("lodash");

const webpackConfig = _.cloneDeep(webpackComponent);

webpackConfig.module.rules.forEach(function(item, i){
    if([".css"].some((v) => item.test.toString().indexOf(v) > -1)){
        webpackConfig.module.rules.splice(i, 1);
    }
})

module.exports = merge(webpackConfig, {
    output: {
        path: path.resolve(process.cwd(), './lib/lib'),
        publicPath: '/lib/',
        filename: '[name].js',
        chunkFilename: '[id].js',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: "styles/[name].css",
                    },
                },
                {
                    loader: "extract-loader",
                },
                {
                    loader: "css-loader",
                }]  
            },
        ]
    }
})
