const { version } = require('./package.json');
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `oneiam-${version}.min.js`,
    library: 'Oneiam',
    libraryExport: 'Oneiam',
  },
  module: {
    rules: [
      { test: /\.ts$/, use: 'ts-loader' },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts'],
  }
}
