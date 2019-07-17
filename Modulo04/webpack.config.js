const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "src", "index.js"),
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js"
  },
  devServer: {
    contentBase: path.resolve(__dirname, "public")
  },
  module: {
    rules: [
      {
        test: /\.js$/, //utilizar todas os arquivos que terminam com .js
        exclude: /node_modules/, // desconsiderar pasta node_modules
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/, //utilizar todas os arquivos que terminam com .js
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          }
        ]
      },
      {
        test: /.*\.(gif|png|jpe?g)$/i, //utilizar todas os arquivos que terminam com .js
        use: {
          loader: "file-loader"
        }
      }
    ]
  }
};
