const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const mode = process.env.NODE_ENV || "development";
const devMode = mode === "development";
const target = devMode ? "web" : "browserslist";
const devtool = devMode ? "source-map" : undefined;

module.exports = {
  mode,
  target,
  devtool,
  devServer: {
    port: 3000,
    open: true,
    hot: true,
  },
  entry: ["@babel/polyfill", path.resolve(__dirname, "src", "index.js")],
  output: {
    path: path.resolve(__dirname, "dist"),
    clean: true,
    filename: "[name].[contenthash].js",
    assetModuleFilename: "files/[name][ext]",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.html"),
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.(c|sa|sc)ss$/i,
        use: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [require("postcss-preset-env")],
              },
            },
          },
          "group-css-media-queries-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.woff2?$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name][ext]",
        },
      },
      {
        // favicons
        test: /(\.*)favicon(\.*)\.(ico|png|svg)/i,
        include: [path.resolve(__dirname, "src/files/favicon")],
        type: "asset/resource",
        generator: {
          filename: "files/favicon/[name][ext]",
        },
      },
      {
        // other images
        test: /\.(jpe?g|png|webp|gif|svg)$/i,
        exclude: [path.resolve(__dirname, "src/files/favicon")],
        use: [
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: {
                progressive: true,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75,
              },
            },
          },
        ],
        type: "asset/resource",
        generator: {
          filename: "[name]-[contenthash][ext]",
        },
      },
      {
        // favicons
        test: /\*favicon\.ico$/,
        loader: "file-loader",
        options: {
          name: "files/favicon/[name].[ext]?[hash:8]",
        },
      },
      {
        test: /\.m?js$/i,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
