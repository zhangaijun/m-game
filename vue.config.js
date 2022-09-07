const StatsPlugin = require('stats-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
module.exports = {
  runtimeCompiler: true,
  publicPath: '/',
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-pxtorem')({
            rootValue: 75, // 换算的基数 Vant 官方根字体大小是 37.5
            propList: ['*'], // Use wildcard * to enable all properties
            selectorBlackList: ['.norem'], // ignore and leave as px
            exclude: /node_modules/
          })
        ]
      }
    }
  },
  // css: {
  //   extract: false,
  // },
  configureWebpack: {
    output: {
      library: 'm-game',
      libraryTarget: 'window',
    },
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './'),
        '@': path.resolve(__dirname, 'src'),
      },
    },
    plugins: [
      new StatsPlugin('manifest.json', {
        chunkModules: false,
        entrypoints: true,
        publicPath: true,
        source: false,
        chunks: false,
        modules: false,
        assets: false,
        children: false,
        exclude: [/node_modules/],
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }
      }),
    ],
    performance: {
      hints: 'warning',
      maxEntrypointSize: 50000000,
      maxAssetSize: 50000000,
      assetFilter: (assetFilename) => {
        return assetFilename.endsWith('.js')
      },
    },
  },
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      '/usr/.*': {
        target: 'http://114.116.12.20:8086/',
        secure: false,
        changOrigin: true,
      }
    },
  },
}
