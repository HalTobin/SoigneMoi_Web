const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '',
        createProxyMiddleware({
            target: 'https://soigne.moi.totouiproject.ovh/api',
            changeOrigin: true,
            pathRewrite: path => path.replace('', '')
        })
    );
};