const superagent = require('superagent');
const cheerio = require('cheerio')

// set params
let entryUrl = 'http://i.xiami.com/musician/artists?spm=a1z1s.7400858.1392350033.4.9rgvv0&genre=16&gender=ALL&location=ALL&order=0&page=1&json=1';
let entryParams = {
	spm: 'a1z1s.7400858.1392350033.4.9rgvv0',
	genre: '16',
	gender: 'ALL',
	location: 'ALL',
	order: '0',
	page: '2',
	json: '1'
}

let _singers = [];

function funcEntry () {

}

/**
 * the entry of the spider
 * @return {}
 */
function spiderEntry(url) {
	superagent
		.get(url)
		// .send(entryParams)
		// .accept('json')
		.end(function(err, res) {
			// console.log(err);
			// console.log(res);
			singerNameGet(res.body);
		});
}

/**
 * Get singers list
 * @param  {String} context html.body
 * @return {}
 */
function singerNameGet(context) {
	let $ = cheerio.load(context.data.html);
	let artistList = $('.artist .image a');

	Array.prototype.slice.call(artistList).forEach(function(value, index) {
		let href = value.attribs.href;
		_singers.push(href);
	})
	console.log(_singers);
	return _singers;
}

let spider = (function() {

	return {
		init() {
			spiderEntry(entryUrl);
		}
	}
})();

module.exports = spider;
