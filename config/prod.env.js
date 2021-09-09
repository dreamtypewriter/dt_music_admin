module.exports = {
    NODE_ENV: '"production"',
    api: '//localhost:8090',
    proxyTable: {
        '/api': {
            // 替换服务地址
            target: "http://localhost:8090",
            changeOrigin: true,
            pathRewrite: {
                '^/api': ''
            }
        }
    }
}
