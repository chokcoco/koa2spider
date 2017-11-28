const Koa = require("koa");
const path = require("path");
const render = require("koa-art-template");
const middleware = require("./app/middleware");

const app = new Koa();

const router = require("./app/routes");

// 模板 art-template 配置
render(app, {
    root: path.join(__dirname, "server/view"),
    extname: ".art"
});

// 引入其他中间件
app.use(middleware());

// 引入路由
app.use(router.routes()).use(router.allowedMethods());

app.listen(8888);

module.exports = app;
