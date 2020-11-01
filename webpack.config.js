const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const path = require('path');
const buildPath = path.resolve(__dirname, 'dist');

module.exports = (env, argv) => {
    const isDevelopment = argv.mode !== 'production';
    const config = {
        mode: isDevelopment ? 'development' : 'production',
        entry: './src/index.js',
        output: {
            path: buildPath,
            filename: isDevelopment ? 'app.js' : 'app.[chunkhash].js',
        },
        devtool: isDevelopment ? 'source-map' : 'eval-source-map',
        devServer: {
            port: 9000,
            contentBase: buildPath,
        },
        module: {
            rules: [
                {
                    test: /\.(html)$/,
                    use: ['html-loader'],
                },
                {
                    test: /\.(scss|css)$/,
                    use: [
                        isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: isDevelopment,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [require('autoprefixer'), require('postcss-csso')],
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: isDevelopment,
                            },
                        },
                    ],
                },
                {
                    test: /\.js?$/,
                    exclude: [/node_modules/],
                    loader: 'babel-loader',
                },
                {
                    test: /\.(jpe?g|png|gif|svg)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: 'assets/images',
                                //     useRelativePath: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.(woff2?)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: 'assets/fonts',
                                useRelativePath: true,
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new CopyPlugin([
                { from: path.resolve(__dirname, 'src', 'favicon-32x32.png'), to: buildPath },
                { from: path.resolve(__dirname, 'src', 'favicon-64x64.png') },
                { from: path.resolve(__dirname, 'src', 'favicon.svg') },
            ]),
            new HtmlWebpackPlugin({
                template: './src/index.html',
                inject: 'body',
                filename: 'index.html',
                minify: !isDevelopment && {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                },
            }),
        ].concat(
            isDevelopment
                ? [new webpack.HotModuleReplacementPlugin(), new StylelintPlugin()]
                : [
                      new MiniCssExtractPlugin({
                          filename: 'app.[hash].css',
                      }),
                  ]
        ),
    };

    return config;
};
