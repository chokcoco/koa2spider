const router = require("koa-router")();
const request = require("../utils/baseRequest");
const render_func = require("../../server/data/tvpay/get_render_data.js");
const through2 = require("through2");
const config = require("../../config/config_tvpay");
const sonicHandle = require("../utils/sonicHandle");

router.get(
    "/",
    async (ctx, next) => {
        await next();
        await sonicHandle(ctx, next);
        console.log("request Done");
    },
    async (ctx, next) => {
        let url = config.GET_PAY_DATA_URL + "?";

        let query_params = ctx.query;
        let cookie_list = ["kt_login", "appid", "access_token", "openid", "vuserid", "vusession", "kt_login_support", "kt_boss_channel"];
        let login_info = {};

        for (let i in cookie_list) {
            //把登录态cookie转到url参数上
            let c_name = cookie_list[i];
            let c_value = ctx.cookies.get(c_name);

            if (c_value) {
                query_params[c_name] = c_value;
            }
            login_info[c_name] = query_params[c_name];
        }

        let index = 0;
        for (let j in query_params) {
            url += (index == 0 ? "" : "&") + j + "=" + encodeURIComponent(query_params[j]);
            index++;
        }

        let result = await request(url);

        try {
            result = JSON.parse(result);
        } catch (ex) {
            ctx.body = "你家测试环境又挂了!";
            return;
        }

        if (result.result.ret == 0) {
            let data = result.data;
            let render_data = render_func.get_render_data(data, query_params, login_info);

            await ctx.render("pages/tvpay/all_state", {
                pages: render_data.pages,
                BOX_TYPE: config.BOX_TYPE,
                PAGE_TYPE: config.PAGE_TYPE,
                vipinfo: JSON.stringify(data.vipinfo),
                pageinfo: JSON.stringify(data.pageinfo),
                userinfo: JSON.stringify(data.userinfo),
                videoinfo: JSON.stringify(data.videoinfo),
                actinfo: JSON.stringify(data.actinfo),
                dealcode: render_data.deal_code
            });

            let body = ctx.body;
            ctx.body = through2();
            ctx.type = "html";
            ctx.body.end(body);
        } else {
            ctx.body = "接口调用返回错误!错误码：" + result.result.ret;
            return;
        }
    }
);

router.get("/main", async (ctx, next) => {
    ctx.body = "main";
});

module.exports = router;
