const StatsPlugin = require('stats-webpack-plugin')
const path = require('path')
module.exports = {
  publicPath: process.env.NODE_ENV === 'development' ? '/' : process.env.VUE_APP_BASE_URL,
  css: {
    extract: false,
  },
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
      '/marketingAdmin/.*': {
        target: 'http://marketing.testehaier.com',
        secure: false,
        changOrigin: true,
      }
    },
  },
}
