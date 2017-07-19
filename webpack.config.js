'use strict';

const path = require('path');
const fs = require('fs');

const Webpack = require('webpack');
const WebpackExtractTextPlugin = require('extract-text-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const extend = require('extend');
const autoprefixer = require('autoprefixer');
const parseArgs = require('minimist');

const isProduction = process.env.NODE_ENV === 'production';
const isServer = process.argv.toString().includes('webpack-dev-server');
const CLIArgs = parseArgs(process.argv.slice(2));
const webDemoURL = CLIArgs['webdemo-url'] || 'http://kotlin-web-demo-cloud.passive.aws.intellij.net';

const webpackConfig = {
  entry: {
    'common': 'page/common.js',
    'index': 'page/index/index.js',
    'events': 'page/events/index.js',
    'videos': 'page/videos.js',
    'grammar': 'page/grammar.js',
    'community': 'page/community/community.js',
    'styles': 'styles.scss',
    'pdf': 'page/pdf.js',
    'api': 'page/api/api.js',
    'embeddable-code': [
      'kotlin-runcode/dist/runcode'.js,
      'kotlin-runcode/dist/vendor.js',
      'kotlin-runcode/dist/runcode.css'
    ]
  },
  output: {
    path: path.join(__dirname, '_assets'),
    publicPath: '/_assets/',
    filename: '[name].js'
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, './static/js'),
      path.resolve(__dirname, './static/css')
    ]
  },

  devtool: !isProduction ? 'sourcemap' : false,

  module: {
    loaders: [
      {
        test: /\.monk$/,
        loader: 'monkberry-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, 'static/js')
        ]
      },
      {
        test: /\.css$/,
        loader: WebpackExtractTextPlugin.extract([
          'css-loader',
          'postcss-loader'
        ].join('!'))
      },
      {
        test: /\.scss$/,
        loader: WebpackExtractTextPlugin.extract([
          'css-loader',
          'postcss-loader',
          'resolve-url-loader?keepQuery',
          'sass-loader?sourceMap'
        ].join('!'))
      },
      {
        test: /\.(woff|ttf)$/,
        loader: 'file-loader?name=[path][name].[ext]'
      },
      {
        test: /\.twig$/,
        loader: 'nunjucks-loader'
      },
      {
        test: /\.svg/,
        loaders: [
          'url-loader',
          'svg-fill-loader'
        ]
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        loader: 'advanced-url-loader?limit=10000&name=[path][name].[ext]'
      },
      {
        test: /\.*$/,
        include: require.resolve('kotlin-runcode'),
        loader: 'file-loader',
        options: {
          name: 'qwroujergi'
        }
      }
    ]
  },


  plugins: [
    new Webpack.optimize.CommonsChunkPlugin({
      name: 'default',
      minChunks: 3
    }),

    new Webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),

    new Webpack.DefinePlugin({
      webDemoURL: JSON.stringify(webDemoURL)
    }),

    new WebpackExtractTextPlugin('[name].css')
  ],

  devServer: {
    proxy: {
      '/**': {
        target: 'http://localhost:5000'
      }
    }
  }
};

if (!isServer) {
  webpackConfig.plugins.push(
    new LiveReloadPlugin({
      appendScriptTag: false
    })
  );
}

module.exports = webpackConfig;


