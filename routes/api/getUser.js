var router = require('koa-router')();
var user_controller = require('../../api/userControllers/getUser');

router.get('/getUser', user_controller.getUser);
router.post('/registerUser', user_controller.registerUser);

module.exports = router;
