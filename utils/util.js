export default {
	/**
	 * 使用 anotherObj 给 obj 定义的对象覆盖赋值
	 * @param  {Object} 对象1
	 * @param  {Object} 对象2
	 * @return {Object} 赋值后的对象
	 */
	 extend(obj, anotherObj) {
		for (var key in obj) {
			if(obj[key] != anotherObj[key] && anotherObj[key]) {
				obj[key] = anotherObj[key];
			}
		}

		return obj;
	}
}
