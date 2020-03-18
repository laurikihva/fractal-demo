const path = require('path');

const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const SvgStorePlugin = require('external-svg-sprite-loader');

const FractalPlugin = require('./packages/fractal-webpack-plugin');

const fractal = require('./fractal.config.js');

module.exports = function(env) {
    let rules = [
        {
            test: /\.(ts|tsx)$/,
            enforce: 'pre',
            loader: 'tslint-loader'
        },
        {
            test: /\.js$/,
            enforce: 'pre',
            loader: 'source-map-loader'
        },
        {
            test: /\.(ts|tsx)?$/,
            use: [
                {
                    loader: 'ts-loader',
                    options: {
                        allowTsInNodeModules: env.fractal ? true : false,
                        compilerOptions: {
                            declaration: env.production && !env.fractal,
                            // these are for correct dynamic import resolution in webpack
                            // should really put them in tsconfig, but that breaks SSR in Fractal
                            module: 'esnext',
                            moduleResolution: 'node',
                        },
                        configFile: env.fractal ? 'tsconfig.fractal.json' : 'tsconfig.json',
                    }
                }
            ]
        },
        {
            test: /\.scss$/,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: '../'
                    }
                },
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: true
                    }
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true,
                        plugins: [
                            require('autoprefixer')()
                        ]
                    }
                },
                {
                    loader: 'resolve-url-loader',
                    options: {
                        sourceMap: true
                    }
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true
                    }
                }
            ]
        },
    ];

    if (env.fractal) {
        rules.push({
            test: require.resolve('react'),
            use: [{
                loader: 'expose-loader',
                options: 'React'
            }]
        });
        rules.push({
            test: require.resolve('react-dom'),
            use: [{
                loader: 'expose-loader',
                options: 'ReactDOM'
            }]
        });
    }

    let plugins = [
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        }),
        new SvgStorePlugin(),
        new webpack.EnvironmentPlugin({
            fractal: env.fractal || false,
            production: env.production || false,
            webpack: true,
            project: 'core',
        })
    ];

    if (!env.production) {
        plugins.push(new StyleLintPlugin());
    }

    if (env.fractal) {
        plugins.push(new FractalPlugin({
            fractal: fractal,
            isProduction: !!env.production,
        }));
    }

    let publicPath = '/';

    if (env.fractal && env.production) {
        publicPath = '../../';
    }

    let entry = {
        index: env.fractal ? './src/index.fractal.ts' : './src/index.ts',
        styles: env.fractal ? './src/styles.fractal.scss' : './src/styles.scss',
    };

    let optimization = {
        noEmitOnErrors: true,
    };

    if (env.fractal) {
        optimization.splitChunks = {
            chunks: 'all',
        };
        optimization.runtimeChunk = true;
    }

    return {
        entry: entry,
        devtool: 'source-map',
        externals: env.fractal ? [] : [
            nodeExternals({
                modulesDir: path.resolve(__dirname, '../../node_modules'),
                whitelist: [/\.(?!(?:jsx?|tsx?|json)$).{1,5}$/i],
            }),
            nodeExternals({
                modulesDir: path.resolve(__dirname, './node_modules'),
                whitelist: [/\.(?!(?:jsx?|tsx?|json)$).{1,5}$/i],
            }),
        ],
        module: {
            rules: rules
        },
        resolve: {
            mainFields: env.fractal ? ['source', 'module', 'main'] : ['module', 'main'],
            // fix issues with duplicate dependencies in linked modules
            symlinks: false,
            modules: [
                path.resolve('../../node_modules'),
                path.resolve('node_modules'),
                'node_modules',
            ],
            extensions: ['.tsx', '.ts', '.jsx', '.js'],
        },
        output: {
            path: path.resolve(__dirname, 'public'),
            publicPath: publicPath,
            filename: 'js/[name].js',
            library: 'components',
            libraryTarget: 'umd'
        },
        plugins: plugins,
        stats: {
            modules: false,
            children: false
        },
        optimization: optimization
    };
};
