/**
 * 接受事件上报
 */
import superagent from'superagent';
import util from'../utils/util';
import mongoDb from '../db/mongoose';

const router = require('koa-router')();

/**
 * link to db
 */
mongoDb.connect();

router.get('/', async function (ctx, next) {
    try {
        await next();
    }catch (err) {
        console.log(err);
    }
    
    ctx.body = "123";

}, async function (ctx, next) {
    let querysObj = ctx.query;
    let defaultReportObj = {
        reportType: "",
        reportValue: "",
        reportDate: new Date().getTime()
    }

    querysObj = util.extend(defaultReportObj, querysObj);

	// 单次上报实体
	let reportEntity = null;

	if (querysObj.reportType && querysObj.reportValue) {
        console.log(querysObj);

		// 存储数据
		reportEntity = new mongoDb.WatchReport(querysObj);

		// 保存数据库
		reportEntity.save((err) => {
			if (err) {
				console.log('保存失败');
				return;
			}
			console.log('入库保存成功');
		});
	}
});

module.exports = router;