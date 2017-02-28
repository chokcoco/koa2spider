const superagent = require('superagent');
const cheerio = require('cheerio');
const eventproxy = require('eventproxy');
const async = require('async');
const fs = require('fs');

const ep = new eventproxy();

/**
 * http://i.xiami.com/musician/artists?spm=a1z1s.7400858.1392350033.2.FblSmg&genre=2&gender=ALL&location=ALL&order=0
 * musci type: 民谣 16 ，流行 2 , 摇滚 3
 */
const type = 16;
const urlPageLength = 1;

// set params
let _singers = [];
let _songs = [];

// counter
let counter = 0;
// timer
let startTime = new Date();


/**
 * spider entry
 */
function entry() {
	for (let i = 1; i <= urlPageLength; i++) {
		let url = 'http://i.xiami.com/musician/artists?genre=' + type + '&gender=ALL&location=ALL&order=0&page=' + i + '&json=1';
		spiderEntry(url);
	}
}

/**
 * the entry of getting singers name array
 * @return {}
 */
function spiderEntry(url) {
	superAgent(url, function (err, res) {
		singerNameGet(res.body);
	})
}

/**
 * step1: Get singers list
 * @param  {String} context html.body
 * @return {}
 */
function singerNameGet(context) {
	let $ = cheerio.load(context.data.html);
	let artistList = $('.artist .image a');

	Array.prototype.slice.call(artistList).forEach(function (value, index) {
		let href = value.attribs.href;
		_singers.push(href);
	});

	ep.emit('singerNameGet');
}

/**
 * step2: Get songs list
 */
ep.after('singerNameGet', urlPageLength, function () {
	console.log('_singers.length', _singers.length);

	/**
	 * mapLimit(coll, limit, iteratee, callback)
	 * @coll [Array | Iterable | Object] A collection to iterate over
	 * @limit [Number] The maximum number of async operations at a time
	 * @iteratee [function] A function to apply to each item in coll. 
	 * @callback [function] A callback which is called when all iteratee functions have finished
	 */
	async.mapLimit(_singers, 10, function (url, callback) {
		url = url + '/top';

		superAgent(url, function (err, res) {
			if (err) {
				throw new Error(err);
			}

			let $ = cheerio.load(res.res.text);
			let songsList = $('.song_name a');
			let singerName = encodeURIComponent($('h1').text());

			Array.prototype.slice.call(songsList).forEach(function (value, index) {
				let href = value.attribs.href;
				_songs.push(href + '#' + singerName);
			})

			callback(null, url + 'Call back content');
		})

	}, function (err, result) {
		console.log('DONE, songs.length', _songs.length);
		console.log('Duration', new Date() - startTime);

		lyricsGet();
	});
});

/**
 * step3: Get lyrics 
 * mapLimit(coll, limit, iteratee, callback)
 */
function lyricsGet() {
	let urlEegExp = /\/mv\//g;

	async.mapLimit(_songs, 2, function (url, callback) {
		let singerName = decodeURIComponent(url.split('#')[1]).replace(/[\s\\]/g, "") || '佚名';
		let randomTimeout = parseInt(Math.random() * 3000, 10);
		console.log('request: ' + url + ', Current concurrent: ' + counter++);

		if (!urlEegExp.test(url)) {
			superAgent(url, function (err, res) {
				if(err) {
					console.log(err);
				}

				let $ = cheerio.load(res.text);
				let lyric = $('.lrc_main').text();
				let songName = $('h1').text().replace(/[\s\\]/g, "") + new Date().getTime();
				let dirPath = __dirname + '\\songs\\' + singerName;
				let filePath = dirPath + '\\' + songName + '.txt';

				if(!lyric) {
					setTimeout(function() {
						callback(null, 'done');
						counter--;
					}, randomTimeout);
				} else {
					fs.exists(dirPath, function (exists) {
						if(exists) {
							fs.writeFile(filePath, lyric, (err) => {
								if(err) {
									console.log(err);
								}
								setTimeout(function() {
									callback(null, 'done');
									counter--;
								}, randomTimeout);
							});
						} else {
							fs.mkdir(dirPath, function (err) {
								if(err) {
									console.log(err);
								}

								fs.writeFile(filePath, lyric, (err) => {
									setTimeout(function() {
										callback(null, 'done');
										counter--;
									}, randomTimeout);
								});
							});
						}
					});
				}
			});
		} else {
			setTimeout(function() {
				counter--;
				callback(null, 'done');
			}, randomTimeout);
		}
	});
}

/**
 * query folder is exist and then create it
 * @param [String] dir folder path
 * @param [String] path file path
 * @param [String] content
 * @param [function] callback
 */
function mkexistThenMkdir(dir, path, content, callback) {
	fs.exists(dir, function (exists) {
		if(exists) {
			fs.writeFile(path, content, (err) => {
				callback('done');
				counter--;
			});
		} else {
			fs.mkdir(dir, function (err) {
				fs.writeFile(path, content, (err) => {
					callback('done');
					counter--;
				});
			});
		}
	});
}

/**
 * use superAgent request url
 * @param [String] url 
 * @param [Object Function] callback
 */
function superAgent(url, callback) {
	superagent.get(url).end(function (err, res) {
		callback.call(this, err, res);
	});
}

let spider = (function () {
	return {
		init() {
			entry();
		}
	}
})();

module.exports = spider;
