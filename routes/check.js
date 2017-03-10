const router = require('koa-router')();
const spider = require('../spider/index');

router.get('check', async function (ctx, next) {
	var singers = spider.init();

  	ctx.body = singers || 'abc';
});

module.exports = router;

