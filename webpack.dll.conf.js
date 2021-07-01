const path = require('path')
const webpack = require('webpack')
/* extract-text-webpack-plugin该插件的主要是为了抽离css样式,防止将样式打包在js中引起页面样式加载错乱的现象
由于与webpack4兼容性问题，打包会提示Entrypoint undefined = extract-text-webpack-plugin-output-filename
*/
// npm install extract-text-webpack-plugin@next --save-dev
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
module.exports = {
  mode: 'production',
  // "vue-router/dist/vue-router.esm.js",
  // "vuex/dist/vuex.esm.js",
  entry: {
    // 需要提取的库文件
    // vendor: ['vue', 'moment',]//'vue-router', 'vuex'用了cdn /'ant-design-vue','iview'是按需引入
    vendor: [
      'vue',
      'moment',
      // 'iview/dist/styles/iview.css',
      './theme/iview-6497B8/index.less',
      'iview/src/components/menu/menu.vue',
      'iview/src/components/layout/layout.vue',
      'iview/src/components/card/card.vue',
      'iview/src/components/layout/content.vue',
      'iview/src/components/icon/icon.vue',
      'iview/src/components/layout/sider.vue',
      'iview/src/components/menu/menu-item.vue',
      'iview/src/components/divider/divider.vue',
      'iview/src/components/switch/switch.vue',
      'iview/src/components/split/split.vue',
      'iview/src/components/button/button-group.vue',
      'iview/src/components/table/table.vue',
      // 'ant-design-vue/lib/table',
      // 'ant-design-vue/lib/button/style',
      // 'ant-design-vue/lib/button',//这样写 ，组件中需要这样按需引入import Button from 'ant-design-vue/lib/button'，build时js才不会被打包进去；用这个import {Button} from "ant-design-vue"，build时js会被打包进去
      // 'ant-design-vue/lib/popover',
      // 'ant-design-vue/lib/tooltip',
      // 'ant-design-vue/lib/form',
      // 'ant-design-vue/lib/input',
      // 'ant-design-vue/lib/icon',
      // 'ant-design-vue/lib/cascader',
      // 'ant-design-vue/lib/tree',
      // 'ant-design-vue/lib/tree-select',
      // 'ant-design-vue/lib/tag',
      // 'ant-design-vue/lib/pagination',
      // 'ant-design-vue/lib/select',
      // 'ant-design-vue/lib/card'

      'ant-design-vue/es/table', // 这样写 ，组件中按需引入import {Button} from "ant-design-vue" ,build时js不会被打包进去
      'ant-design-vue/es/button',
      'ant-design-vue/es/popover',
      'ant-design-vue/es/tooltip',
      'ant-design-vue/es/form',
      'ant-design-vue/es/input',
      'ant-design-vue/es/icon',
      'ant-design-vue/es/cascader',
      'ant-design-vue/es/tree',
      'ant-design-vue/es/tree-select',
      'ant-design-vue/es/tag',
      'ant-design-vue/es/pagination',
      'ant-design-vue/es/select',
      'ant-design-vue/es/card',
      'ant-design-vue/es/date-picker',

      'ant-design-vue/es/table/style',
      'ant-design-vue/es/button/style',
      'ant-design-vue/es/popover/style',
      'ant-design-vue/es/tooltip/style',
      'ant-design-vue/es/form/style',
      'ant-design-vue/es/input/style',
      'ant-design-vue/es/icon/style',
      'ant-design-vue/es/cascader/style',
      'ant-design-vue/es/tree/style',
      'ant-design-vue/es/tree-select/style',
      'ant-design-vue/es/tag/style',
      'ant-design-vue/es/pagination/style',
      'ant-design-vue/es/select/style',
      'ant-design-vue/es/card/style',
      'ant-design-vue/es/date-picker/style'
    ]
  },
  output: {
    path: path.join(__dirname, 'public/vendor'),
    filename: '[name].dll.js',
    library: '[name]_[hash]' // vendor.dll.js中暴露出的全局变量名
  },
  plugins: [
    // 设置环境变量 表明这个配置适用于生产环境
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: 'production'
      }
    }),
    // manifest.json 描述动态链接库包含了哪些内容
    new webpack.DllPlugin({
      path: path.join(__dirname, 'public/vendor', '[name]-manifest.json'),
      name: '[name]_[hash]',
      context: process.cwd()
    }),
    // new ExtractTextPlugin({
    //   filename: '[name].dll.css'
    // }),
    new MiniCssExtractPlugin({
      filename: '[name].dll.css'
    }),
    new VueLoaderPlugin()
  ],
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        // 遇到路径为文件名为iview.src.xxxxjs的都用babel转换为ES5的支持的语法
        test: /iview.src.*?js$/,
        loader: 'babel-loader'
      },
      {
        test: /ant-design-vue.es.*?js$/,
        loader: 'babel-loader'
      },
      {
        // test: /\.css$/,
        // use: ExtractTextPlugin.extract({
        //   use: "css-loader"
        // })
        // test: /\.less$/,
        // use: ExtractTextPlugin.extract({
        //   // fallback: 'style-loader',
        //   use: ['css-loader', {
        //     loader: 'less-loader',
        //     options: {
        //       javascriptEnabled: true
        //     }
        //   }],
        // })

        // test: /\.css$/,
        // use: [{
        //     loader: MiniCssExtractPlugin.loader,
        //     options: {
        //       // you can specify a publicPath here
        //       // by default it uses publicPath in webpackOptions.output
        //       // publicPath: '../',
        //       // hmr: process.env.NODE_ENV === 'development',
        //       minimize: true
        //     },
        //   },
        //   'css-loader'
        // ],
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
              modifyVars: {
                'primary-color': '#6497B8',
                'link-color': '#6497B8',
                'border-radius-base': '6px'
              }
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          publicPath: './',
          limit: 1000,
          name: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  }
}
