const { version } = require('./package.json');
const path = require('path');
const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `oneiam-${version}.min.js`,
    library: 'Oneiam',
    libraryExport: 'Oneiam',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      { test: /\.ts$/, use: '@ngtools/webpack' },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  plugins: [
    new AngularCompilerPlugin({
      tsConfigPath: './tsconfig.json',
      entryModule: './src/angular/module#OneiamModule',
      sourceMap: true,
      enableIvy: true,
    }),
  ]
}
