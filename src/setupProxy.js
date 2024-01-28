const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://soigne.moi.totouiproject.ovh',
            changeOrigin: true,
            pathRewrite: path => path.replace('/api', '')
        })
    );
};