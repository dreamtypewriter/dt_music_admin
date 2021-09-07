// 导入check-versions.js文件，并且执行导入的函数，用来确定当前环境node和npm版本是否符合要求
require('./check-versions')()
// 导入config目录下的index.js配置文件，此配置文件中定义了生产和开发环境中所要用到的一些参数
// 下面表示如果如果没有定义全局变量NODE_ENV，则将NODE_ENV设置为"development"
var config = require('../config')
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

// opn插件是用来打开特定终端的，此文件用来在默认浏览器中打开链接 opn(url)
var opn = require('opn')
// nodejs路径模块
var path = require('path')
// nodejs开发框架express，用来简化操作，有兴趣可以自行去了解
var express = require('express')
// 引入webpack模块，用来使用webpack内置插件
var webpack = require('webpack')
// 引入http-proxy-middleware插件，此插件是用来代理请求的只能用于开发环境，目的主要是解决跨域请求后台api
var proxyMiddleware = require('http-proxy-middleware')
// 下面的意思是指，如果不是testing环境就引入webpack.dev.conf.js配置文件
var webpackConfig = process.env.NODE_ENV === 'testing'
    ? require('./webpack.prod.conf')
    : require('./webpack.dev.conf')


// default port where dev server listens for incoming traffic
// 下面是webpack-dev-server 监听的端口号，因为没有设置process.env.PORT，所以下面监听的就是config.dev.port即8080
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
// 下面是true,至于为啥，本来就是true还要加!!两个感叹号，估计是vue作者装了个逼吧
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
// 下面是解决开发环境跨域问题的插件
var proxyTable = config.dev.proxyTable
// 下面是创建node.js的express开发框架的实例
var app = express()
// 把配置参数传递到webpack方法中，返回一个编译对象，这个编译对象上面有很多属性
var compiler = webpack(webpackConfig)

// 下面是webpack-dev-middleware和webpack-hot-middleware两兄弟，这两个是黄金组合
var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: () => {
    }
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        hotMiddleware.publish({action: 'reload'})
        cb()
    })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
    var options = proxyTable[context]
    if (typeof options === 'string') {
        options = {target: options}
    }
    app.use(proxyMiddleware(options.filter || context, options))
})

var context = config.dev.context

switch (process.env.NODE_ENV) {
    case 'local':
        var proxypath = 'http://localhost:8001';
        break;
    case 'online':
        var proxypath = 'http://elm.cangdu.org';
        break;
}
var options = {
    target: proxypath,
    changeOrigin: true,
}
if (context.length) {
    app.use(proxyMiddleware(context, options))
}
// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
    _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
    console.log('> Listening at ' + uri + '\n')
    // when env is testing, don't need open it
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
        opn(uri)
    }
    _resolve()
})

var server = app.listen(port)

module.exports = {
    ready: readyPromise,
    close: () => {
        server.close()
    }
}
