var router = require('koa-router')();


router.get('/', async function (ctx, next) {
  var json = {
    taskSystem:[1, 3, 10, 20, 0, 3, 0, 1, 18, 0, 9, 0],
    weektask:[2, 4, 0, 5, 15.5, 18, 0, 20, 23, 0, 3, 4]
  };

  ctx.state = {
    data: {
      title : 'jade',
      data: JSON.stringify(json)
    }
  };
  
  await ctx.render('index', {});
})

module.exports = router;
