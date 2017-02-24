const superagent = require('superagent');
const cheerio = require('cheerio');
const eventproxy = require('eventproxy');
const async = require('async');

/**
 * http://i.xiami.com/musician/artists?spm=a1z1s.7400858.1392350033.2.FblSmg&genre=2&gender=ALL&location=ALL&order=0
 * musci type: 民谣 16 ，流行 2 , 摇滚 3
 */ 
const type = 16;
const urlPageLength = 5;

// set params
let _singers = [];
let _songs = [];
let i = 1;
let ep = new eventproxy();

/**
 * spider entry
 */
function entry () {
	for(let i=1; i<=urlPageLength; i++) {
		let url = 'http://i.xiami.com/musician/artists?genre=' + type + '&gender=ALL&location=ALL&order=0&page=' + i + '&json=1';
		spiderEntry(url);
	}
}

/**
 * the entry of getting singers name array
 * @return {}
 */ 
function spiderEntry(url) {
	superAgent(url, function(err, res) {
		singerNameGet(res.body);
	})
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

/**
 * 歌手主页URL收集完成后回调
 */
ep.after('singerNameGet', urlPageLength, function() {
	console.log('_singers.length', _singers.length);
	// next eventproxy listener
	nextListener();

	_singers.forEach(function(value) {
		let url = value + '/top';
		try {
			superAgent(url, function(err, res) {
				if(err) {
					throw new Error(err);
					console.log(err);
				}

				let $ = cheerio.load(res.res.text);
				let songsList = $('.song_name a');

				Array.prototype.slice.call(songsList).forEach(function(value, index) {
					let href = value.attribs.href;
					_songs.push(href);
				})
				console.log(i++);
				ep.emit('songsUrlGet');
			})
		}catch (err) {
			throw new Error(err);
			console.log(err);
		}
	});
})

/**
 * 歌曲主页URL收集完成后回调
 */
function nextListener(){
	ep.after('songsUrlGet', _singers.length, function() {
		console.log('_songs.length', _songs.length);
		// console.log('_songs', _songs);
	})
}

/**
 * 使用 superAgent 请求 url
 * @param [String] url 
 * @param [Object Function] callback
 */
function superAgent(url, callback) {
	superagent.get(url).end(function(err, res) {
		callback.call(this, err, res);
	});
}

let spider = (function() {
	return {
		init() {
			entry ();
		}
	}
})();

module.exports = spider;
