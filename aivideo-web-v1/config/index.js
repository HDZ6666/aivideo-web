"use strict";
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require("path");
// const apiProxy = 'http://localhost:18080'
// const apiProxy = "http://192.168.124.5:18080"
const apiProxy = "http://172.16.66.77:18080"
module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: "static",
    assetsPublicPath: "/",
    proxyTable: {
      "/debug": {
        target: apiProxy,
        // target: 'http://172.16.1.106:18080',
        // target: "http://192.168.1.105:18080",
        // target: "http://10.16.139.254:18080",
        // target: "https://fyict.cn:18080",
        // target: "http://172.16.66.77:18080",
        // target: "http://192.168.0.151:18080",
        changeOrigin: true,
        pathRewrite: {
          "^/debug": "/"
        }
      },
      "/static/snap": {
        target: apiProxy,
        // target: "http://172.16.1.106:18080",
        // target: "http://192.168.1.105:18080",
        // target: "http://172.16.66.77:18080",
        changeOrigin: true
        // pathRewrite: {
        //   '^/static/snap': '/static/snap'
        // }
      },
      "/api": {
        // target: 'http://localhost:18080',
        target: apiProxy,
        changeOrigin: true
      },
      "/ai/api": {
        target: apiProxy,
        changeOrigin: true
      },
      "/cockpit/api": {
        target: apiProxy,
        changeOrigin: true
      },
      "/pc": {
        target: "http://localhost:3001",
        changeOrigin: true,
        ws: true
      },
      "/mobile": {
        target: "http://localhost:3002",
        changeOrigin: true,
        ws: true
      },
      "/datav": {
        target: "http://localhost:3003",
        changeOrigin: true,
        ws: true
      },
      "/react": {
        target: "http://localhost:8066",
        changeOrigin: true,
        ws: true
      },
      "/livePlayer": {
        target: "http://localhost:8066", 
        changeOrigin: true
      }
    },

    // Various Dev Server settings
    // host:"172.16.1.106",
    host: "127.0.0.1",
    useLocalIp: false, // can be overwritten by process.env.HOST
    // port: 8088, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    port: 80, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    hot: true, //自动保存
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: "cheap-module-eval-source-map",

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    // index: path.resolve(
    //   __dirname,
    //   "../../src/main/resources/static/index.html"
    // ),

    index: path.resolve(__dirname, "../dist/index.html"),

    // Paths
    assetsRoot: path.resolve(__dirname, "../../dist/"),
    // assetsRoot:  path.resolve(__dirname, "../../src/main/resources/static/"),
    // assetsRoot:'dist',
    assetsSubDirectory: "./static",
    assetsPublicPath: "/",

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: "#source-map",

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ["js", "css"],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
};
