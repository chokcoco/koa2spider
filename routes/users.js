/**
 * 根据YY号信息查询用户信息
 */
const router = require('koa-router')();
const superagent = require('superagent');

let info = null;
let id = 0;

router.get('/', async function(ctx, next){
    id = ctx.params.id;

    ctx.user = await next(); 
    ctx.body = info;
}, async function(ctx, next) {

    await new Promise(function(resolve, reject){
        superagent
            .get('http://webdb.yyembed.yy.com/webdb/query_userinfo')
            .query({ 
                type: 2, 
                value: id
            })
            .end(function (err, res) {
                if(res.body.info && res.body.result) {
                    let data = res.body.info;
                    info = `
                            <p>昵称：${data.nick}</p>
                            <p>介绍：${data.intro}</p>
                            <p>UID：${data.uid}</p>
                            <p>IMID：${data.imid}</p>
                            <p>PASSPORT：${data.passport}</p>
                            `;
                    resolve('done');
                }                             
            });
    });
});

module.exports = router;