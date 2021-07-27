const Dotenv = require('dotenv-webpack');
const path = require('path');
const CONFIG = {
  mode: 'development',

  entry: {
    app: './src/app.js'
  },
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    index: 'index.html'
  },
  plugins: [
    new Dotenv()
  ]
};

// This line enables bundling against src in this repo rather than installed module
module.exports = CONFIG;
