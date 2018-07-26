const path = require('path');
const config = require('./src/config.json');

/**
 * 生成Proxy配置
 */
const proxy = {};
for (let route of Reflect.ownKeys(config.service)) {
  let item = {}
  item['target'] = config.service[route]
  item['pathRewrite'] = {}
  item['pathRewrite']['^/' + route] = ''
  item['changeOrigin'] = true
  item['secure'] = false
  proxy['/' + route] = item
}

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.json', '.vue'],
      alias: {
        src: path.resolve('./src'),
        utils: path.resolve('./src/utils'),
      },
    },
  },
  devServer: {
    proxy,
  },
};
