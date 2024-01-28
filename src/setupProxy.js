const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:9091',
            changeOrigin: true,
            pathRewrite: path => path.replace('/api', '')
        })
    );
};