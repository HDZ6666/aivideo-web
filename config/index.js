"use strict";
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require("path");

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: "static",
    assetsPublicPath: "/",
    proxyTable: {
      "/debug": {
        // target: 'http://localhost:18080',
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        target: "http://183.239.58.24:18080",
        // target: 'http://172.16.1.106:18080',
        // target: 'http://192.168.1.110:18080',
=======
        // target: 'http://172.16.1.106:18080',
        target: 'http://192.168.1.102:18080',
>>>>>>> 155fd1d... 允许域名访问
=======
        target: 'http://172.16.1.106:18080',
        // target: 'http://192.168.1.105:18080',
>>>>>>> 9f085ca... 优化登录页，允许域名访问
=======
        // target: 'http://172.16.1.106:18080',
        target: "http://192.168.1.105:18080",
>>>>>>> cf4d871... feat 修改弹窗样式
=======
        // target: 'http://172.16.1.106:18080',
        target: 'http://192.168.1.105:18080',
>>>>>>> d24eced... 修复webrtc无法正常播放问题
        changeOrigin: true,
        pathRewrite: {
          "^/debug": "/"
        }
      },
      "/static/snap": {
        // target: 'http://localhost:18080',
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        target: "http://172.16.1.106:18080",
        // target: 'http://192.168.1.110:18080',
        changeOrigin: true
=======
        // target: 'http://172.16.1.106:18080',
        target: 'http://192.168.1.102:18080',
=======
        target: 'http://172.16.1.106:18080',
        // target: 'http://192.168.1.105:18080',
>>>>>>> 9f085ca... 优化登录页，允许域名访问
=======
        // target: 'http://172.16.1.106:18080',
        target: 'http://192.168.1.105:18080',
>>>>>>> d24eced... 修复webrtc无法正常播放问题
        changeOrigin: true,
>>>>>>> 155fd1d... 允许域名访问
=======
        target: "http://172.16.1.106:18080",
        // target: 'http://192.168.1.105:18080',
        changeOrigin: true
>>>>>>> cf4d871... feat 修改弹窗样式
        // pathRewrite: {
        //   '^/static/snap': '/static/snap'
        // }
<<<<<<< HEAD
=======
      },
      "/debug/video": {
        // target: 'http://localhost:18080',
        // target: "http://183.239.58.24:18080/ai/api",
        target: "http://192.168.1.105:18080/ai/api",
        // target: 'http://192.168.1.105:18080',
        changeOrigin: true,
        pathRewrite: {
          "^/debug/video": ""
        }
>>>>>>> d24eced... 修复webrtc无法正常播放问题
      }
    },

    // Various Dev Server settings
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    // host:"172.16.1.106",
<<<<<<< HEAD
    host: "127.0.0.1",
    // host:"192.168.1.110",
=======
    host:"192.168.1.102",
>>>>>>> 155fd1d... 允许域名访问
=======
    host:"172.16.1.106",
    // host:"192.168.1.105",
>>>>>>> 9f085ca... 优化登录页，允许域名访问
=======
    // host:"172.16.1.106",
    host: "192.168.1.106",
>>>>>>> cf4d871... feat 修改弹窗样式
    useLocalIp: false, // can be overwritten by process.env.HOST
    // port: 8088, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    port: 8077, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
=======
    // host:"172.16.1.106",
    host:"192.168.1.105",
    useLocalIp: false, // can be overwritten by process.env.HOST
    port: 8088, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    // port: 80, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
>>>>>>> d24eced... 修复webrtc无法正常播放问题
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
    index: path.resolve(
      __dirname,
      "../../src/main/resources/static/index.html"
    ),

    // Paths
    assetsRoot: path.resolve(__dirname, "../../src/main/resources/static/"),
    assetsSubDirectory: "./static",
    assetsPublicPath: "/",

    /**
     * Source Maps
     */

    productionSourceMap: true,
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
