const path = require('path');
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
    entry: './src/app/controlers/main.js',
    devtool: 'source-map',
    //TẠO RA FILE CSS
    // plugins: [
    //   new MiniCssExtractPlugin({
    //     // Options similar to the same options in webpackOptions.output
    //     // both options are optional
    //     filename: "[name].css",
    //     chunkFilename: "[id].css"
    //   })
    // ],
    //END TẠO RA FILE CSS
    module: {
        rules: [
            //SASS LOADER ÐỂ ÐÓNG GÓI CÁC FILE SASS
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader", // translates CSS into CommonJS
                    options: {
                        minimize: true,
                    }
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }, ]
            },
            //CSS LOADER ĐỂ ÐÓNG GÓI CÁC FILE CSS
            {
                test: /\.css$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader",
                    options: {
                        minimize: true,
                    }
                }],

            },
            //ÐÓNG GÓI HÌNH ẢNH
            {
                test: /\.(jpg|png)$/,
                use: {
                    loader: "url-loader",
                    options: {
                        name: "../[path][name].[ext]",
                        limit: 1000,
                    },
                },
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&minetype=application/font-woff"
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader"
            }
        ]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './src/assets/dist')
    },
    // Fix chữ vàng
    mode: "production"

};