const path = require('path')
// const defaultSettings = require('./src/settings.js')
function resolve(dir) {
    return path.join(__dirname, dir)
}

// const name = defaultSettings.title || ""// page title

module.exports = {
    runtimeCompiler: true,
    publicPath: '/',
    outputDir: 'autonomous-configuration-template',//打包名
    // assetsDir: 'static',//静态资源目录
    lintOnSave: false,
    productionSourceMap: false,
    devServer: {
        // host: '10.10.10.224',
        port: 8029,//端口号
        open: true,//配置自动启动浏览器
        overlay: {
            warnings: true,
            errors: true
        },
        proxy: {
            '/': {
                target: 'https://npa.lishu-fd.com/',
                changOrigin: true,//允许跨域
                ws: false,
                pathRewrite: {
                    '^/': ''//请求的时候使用这个api就可以
                }
            },
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@': resolve('src')
            }
        }
    }
}
