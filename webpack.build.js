var config = require('./webpack.config.js')

config.entry = {
  'vue-bootstrap-table': './src/index.js',
}

config.output = {
  filename: './dist/[name].js',
  library: 'VueBootstrapTable',
  libraryTarget: 'umd'
}


module.exports = config
