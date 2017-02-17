var router = require('koa-router')();
var getUser = require('./getUser');

router.use('/getUser', getUser.routes(), getUser.allowedMethods());

module.exports = router;
