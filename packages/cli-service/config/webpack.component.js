const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const nodeExternals = require('webpack-node-externals');

const Components = require(
    path.resolve(process.cwd(), 
    './components/components.json')
);
const entries = {};

Components.forEach(v => {
    entries[v.name] = v.fullPath;
})

const webpackConfig = {
    mode: 'production',
    entry: entries,
    output: {
        path: path.resolve(process.cwd(), './lib'),
        publicPath: '/lib/',
        filename: '[name].js',
        chunkFilename: '[id].js',
        libraryTarget: 'commonjs2'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json']
    },
    externals: [{
        vue: 'vue'
    }, nodeExternals()],
    stats: 'none',
    optimization: {
        minimize: true
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader'
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    compilerOptions: {
                        preserveWhitespace: false
                    }
                }
            },
            // {
            //     test: /\.css$/,
            //     loaders: ['style-loader', 'css-loader'] 
            // },
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
            {
                test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: path.posix.join('static', '[name].[hash:7].[ext]')
                }
            }
        ]
    },
    plugins: [
        new ProgressBarPlugin(),
        new VueLoaderPlugin()
    ]
}

module.exports = webpackConfig;
