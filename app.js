const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const views = require('koa-views');
const co = require('co');
const fs = require('fs');
const thunkify = require('thunkify');
const convert = require('koa-convert');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');

const index = require('./routes/index');
const users = require('./routes/users');
const check = require('./routes/check');
// const spider = require('./spider/index');

// middlewares
app.use(convert(bodyparser));
app.use(convert(json()));
app.use(convert(logger()));
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {
	extension: 'jade'
}));

app.use(async (ctx, next) => {
	let startTime = new Date();
	let ms = 0;

	try {
		await next();
		ms = new Date() - startTime;
		console.log('response time is ' + ms);
	} catch (err) {
		ms = new Date() - startTime;
		logger.error('server error', err, ms);
	}
});

router.use('/', index.routes(), index.allowedMethods());
router.use('/users/:id', users.routes(), users.allowedMethods());
router.use('/check', check.routes(), check.allowedMethods());

app.use(router.routes(), router.allowedMethods());

// 错误日志
app.on('error', function (err, ctx) {
	console.log(err);
	logger.error('server error', err, ctx);
});

module.exports = app;
