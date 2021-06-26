const path = require('path')
const webpack = require('webpack')
const HtmlWebpackInlinePlugin = require('html-webpack-inline-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
function resolve (dir) {
  return path.join(__dirname, dir)
}

const isProd = process.env.NODE_ENV === 'production'
const VERSION = new Date().toLocaleString()
const assetsCDN = {
  // webpack build externals
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    axios: 'axios',
    echarts: 'echarts'
  },
  css: [],
  js: [
    '//cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js',
    '//cdn.jsdelivr.net/npm/vue-router@3.4.9/dist/vue-router.min.js',
    '//cdn.jsdelivr.net/npm/axios@0.21.1/dist/axios.min.js',
    '//cdn.jsdelivr.net/npm/echarts@5.1.1/dist/echarts.js'
  ]
}

// vue.config.js
const vueConfig = {
  publicPath: './',
  outputDir: 'dist-' + process.env.ENV,
  configureWebpack: config => {
    if (isProd) {
      config.externals = assetsCDN.externals
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            warnings: false,
            compress: {
              drop_debugger: true,
              drop_console: true, // 清除console语句
              pure_funcs: ['console.log']
            }
          },
          sourceMap: false,
          parallel: true
        }),
        new CompressionWebpackPlugin({
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8
        })
      )
    }
    return {
      plugins: [
        new HtmlWebpackInlinePlugin({
          compress: false
        }),
        // Ignore all locale files of moment.js
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.DefinePlugin({
          'process.version': '"' + VERSION + '"'
        })
      ]
    }
  },
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.directives = {
          html (node, directiveMeta) {
            // onIgnoreTagAttr 自定义匹配到不在白名单上的属性时的处理方法
            ;(node.props || (node.props = [])).push({
              name: 'innerHTML',
              value: `xss(_s(${directiveMeta.value}), {
                onIgnoreTagAttr: function (tag, name, value, isWhiteAttr) {
                  return name + '="' + value + '"';
                },
              })`
            })
          }
        }
        return options
      })
    config.resolve.alias.set('@$', resolve('src'))
    // if prod is on
    // assets require on cdn
    config.plugin('html').tap(args => {
      if (isProd) {
        args[0].cdn = assetsCDN
      }
      args[0].title = process.env.VUE_APP_PROJECT_TITLE
      return args
    })
  },

  css: {
    sourceMap: !isProd,
    extract: false, // Default: 生产环境下是 true，开发环境下是 false; 提取 CSS 在开发环境模式下是默认不开启的，因为它和 CSS 热重载不兼容
    loaderOptions: {
      sass: {
        additionalData: '@import "@/assets/styles/mixin.scss";'
      },
      less: {
        lessOptions: {
          modifyVars: {
            'font-family': 'AlibabaPuHuiTi-Regular'
          },
          javascriptEnabled: true
        }
      }
    }
  },

  devServer: {
    // development server port 8000
    port: 9000,
    open: false,
    // 让浏览器 overlay 同时显示eslint的警告和错误
    overlay: {
      warnings: false,
      errors: true
    }
    // proxy: {
    //   '/api': {
    //     // target: 'http://scsf-app-dev.local:12106',
    //     target: 'http://10.10.10.117:12106',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/api': '/'
    //     }
    //   },
    //   '/app': {
    //     target: 'http://127.0.0.1:12107',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/app': '/'
    //     }
    //   },
    //   '/file': {
    //     target: 'http://127.0.0.1:12106',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/': '/'
    //     }
    //   }
    // }
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: true,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}

module.exports = vueConfig
