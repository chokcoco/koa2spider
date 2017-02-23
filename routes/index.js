var router = require('koa-router')();

router.get('/', async function (ctx, next) {
  ctx.state = {
    title: 'koa222 title'
  };
  
  await ctx.render('index', {
  });
})
module.exports = router;
