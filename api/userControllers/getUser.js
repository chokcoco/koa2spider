/**
 * get Users
 */
module.exports.getUser = async(ctx, next) => {
	ctx.body = {
		username: 'Coco',
		age: 18
	}
}

/**
 * user register
 */
module.exports.registerUser = async (ctx, next) => {
    console.log('registerUser', ctx.request.body);
}
