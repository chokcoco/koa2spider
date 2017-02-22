const superagent = require('superagent');
const cheerio = require('cheerio');
const eventproxy = require('eventproxy');

const urlPageLength = 20;

// set params
let _singers = [];
let ep = new eventproxy();

function entry () {
	for(let i=1; i<=urlPageLength; i++) {
		let url = 'http://i.xiami.com/musician/artists?spm=a1z1s.7400858.1392350033.4.9rgvv0&genre=16&gender=ALL&location=ALL&order=0&page=' + i + '&json=1';
		spiderEntry(url);
	}
}

/**
 * the entry of the spider
 * @return {}
 */ 
function spiderEntry(url) {
	superagent
		.get(url)
		.end(function(err, res) {
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
	ep.emit('singerNameGet');
}

ep.after('singerNameGet', urlPageLength, function() {
	console.log(_singers);
	console.log(_singers, _singers.length);
})

let spider = (function() {
	return {
		init() {
			entry ();
		}
	}
})();

module.exports = spider;
