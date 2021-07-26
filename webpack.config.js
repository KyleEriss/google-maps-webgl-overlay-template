const path = require('path');
const webpack = require('webpack');
const CONFIG = {
  mode: 'development',

  entry: {
    app: './src/app.js'
  },
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    index: 'index.html'
  },

//   plugins: [
//     // Read google maps token from environment variable
//     new webpack.EnvironmentPlugin(['Google Maps API Key'])
//   ]
};

// This line enables bundling against src in this repo rather than installed module
module.exports = CONFIG;
