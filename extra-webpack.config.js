const PurgecssPlugin = require("purgecss-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const glob = require("glob-all");

const PATHS = {
  src: path.join(__dirname, "src")
};

module.exports = {
  plugins: [
    new PurgecssPlugin({
      whitelist: ["tooltip"],
      whitelistPatterns: [/^tooltip-/],
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true })
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
