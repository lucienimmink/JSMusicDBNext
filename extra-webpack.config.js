const PurifyCSSPlugin = require("purifycss-webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const glob = require("glob-all");

module.exports = {
  plugins: [
    new PurifyCSSPlugin({
      paths: glob.sync([
        path.join(__dirname, "src/**/*.html"),
        path.join(__dirname, "src/**/*.ts")
      ]),
      minimize: true,
      purifyOptions: {
        whitelist: ["title-bar*", "title-bar-btns", "*tooltip*"]
      }
    }),
    new CopyWebpackPlugin([
      {
        from: "./src/app/sw.js",
        to: "sw.js"
      },
      {
        from: "./src/global",
        to: "global"
      }
    ])
  ]
};