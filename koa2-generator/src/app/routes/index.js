const compose = require("koa-compose");
const router = require("koa-router")();

// 引入路由目录
const tvpay = require("./tvpay");

// 使用路由目录
router.use("/nktweb/pay/tvpay", tvpay.routes(), tvpay.allowedMethods());

// 默认路由
router.get("/", async (ctx, next) => {
    ctx.status = 404;
    ctx.type = "html";
    ctx.body = "404 Not Found";
});
module.exports = router;
