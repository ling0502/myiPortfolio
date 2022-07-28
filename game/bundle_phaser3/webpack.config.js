var path = require('path')
var webpack = require('webpack')
    //壓縮時去掉console用插件
const TerserPlugin = require('terser-webpack-plugin')

// Phaser webpack config
var phaserModule = path.join(__dirname, '/node_modules/phaser/')
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
var pixi = path.join(phaserModule, 'build/custom/pixi.js')
var p2 = path.join(phaserModule, 'build/custom/p2.js')

module.exports = {
    mode: "development",
    //devtool:"eval",
    entry: path.resolve(__dirname, '../games999/js/src/config.js'), // 'src/index.js' / '../games027/js/src/config.js' / games027 / ../games022/js/game_source.js

    output: {
        //pathinfo: true,
        path: path.resolve(__dirname, '../games999/js'), // dist / '../farm/js' / games027
        publicPath: './',
        filename: 'game.js' // bundle.js / game.js
    },

    performance: {
        // 文件大小超出限制时发出性能提示
        maxAssetSize: 500000, // 500kb
        maxEntrypointSize: 500000, // 500kb
    },

    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    cache: true,
                    compress: {
                        drop_console: true
                    },
                    output: {
                        comments: false,
                    },
                }
            })
        ]
    },

    module: {
        rules: [
            { test: /pixi\.js/, use: ['expose-loader?PIXI'] },
            { test: /phaser-split\.js$/, use: ['expose-loader?Phaser'] },
            { test: /p2\.js/, use: ['expose-loader?p2'] },

            { test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src') },
            // exclude: /node_modules/
            {
                test: /\.(png|gif|ttf)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: "[name]-[hash].[ext]",
                    outputPath: './assets', //預設路徑./dist/
                },
            },
        ]
    },
    resolve: {
        alias: {
            'phaser': phaser,
            'pixi': pixi,
            'p2': p2
        }
    }
}