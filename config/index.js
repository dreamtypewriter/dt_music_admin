// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
    build: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../dt_music_admin/index.html'),
        assetsRoot: path.resolve(__dirname, '../dt_music_admin'),
        assetsSubDirectory: 'static',
        assetsPublicPath: './',
        productionSourceMap: false,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    },
    dev: {
        // 开发下配置

        // 子目录,存放css,js,image等文件
        assetsSubDirectory: 'static',
        // 根目录
        assetsPublicPath: '/',
        //
        env: require('./dev.env'),
        // host
        host: 'localhost',
        // port
        port: 8082,
        // 解决跨域的问题,配置代理表
        proxyTable: {
            '/api': {
                // 目标服务地址
                target: "http://localhost:8090",
                // 
                changeOrigin: true,
                //
                ws : true,
                // 替换规则
                pathRewrite: {
                    '^/api': '/'
                }
            }
        },
        // 自动打开页面 host://port
        autoOpenBrowser: true,
        //代理路径
        context: [
            // '/shopping',
            // '/ugc',
            // '/v1',
            // '/v2',
            // '/v3',
            // '/v4',
            // '/bos',
            // '/member',
            // '/promotion',
            // '/eus',
            // '/payapi',
            // '/admin',
            // '/statis',
            // '/img',
        ],
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false
    }
}
