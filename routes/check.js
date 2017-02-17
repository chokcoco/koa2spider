var router = require('koa-router')();

router.get('/', function (ctx, next) {
  	ctx.body = {
		username: 'Coco',
		age: 18
	}
});

module.exports = router;
