const webpackConfig = require("./webpack.component");
const { merge } = require("webpack-merge");
const nodeExternals = require('webpack-node-externals');
const path = require("path");
const cwd = process.cwd();

// externals for components
const Components = require(path.resolve(cwd, "./components/components.json"));
const pkg = require(path.resolve(cwd, "package.json"));
const externalsValue = {};

Components.forEach(item => {
    externalsValue[`./${item.name}`] = `${pkg.name}/lib/${item.name}`
})
externals = [
    Object.assign({
        vue: 'vue'
    }, externalsValue, nodeExternals())
]

module.exports = merge(webpackConfig, {
    entry: path.resolve(process.cwd(), "components/entry.js"),
    output: {
        path: path.resolve(process.cwd(), './lib'),
        publicPath: '/lib/',
        filename: 'components.common.js',
        chunkFilename: '[id].js',
        libraryExport: 'default',
        libraryTarget: 'commonjs2'
    },
    externals
})
