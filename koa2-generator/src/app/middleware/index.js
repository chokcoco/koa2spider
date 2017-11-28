// middleware/index.js
const compose = require("koa-compose");
const convert = require("koa-convert");
const helmet = require("koa-helmet");
const cors = require("koa-cors");
const bodyParser = require("koa-bodyparser");

// const session = require('koa-generic-session');
// const RedisStore = require('koa-redis');

function middleware() {
    return compose([
        // 提供安全的header
        helmet(),
        // 跨域 配置 Access-Control-Allow-Origin CORS header.
        convert(cors()),
        // 解析 body，存储在 ctx.request.body 里
        convert(bodyParser())
        // convert(session({ // session
        //     store: new RedisStore()
        // })),
    ]);
}

module.exports = middleware;
