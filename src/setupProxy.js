const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      // target: 'http://0.0.0.0:3001/',
      target: 'http://news.qiaofugui.cn:3001/',
      changeOrigin: true,
    })
  );
};