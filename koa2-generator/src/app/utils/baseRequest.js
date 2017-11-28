const request = require("request");

function requestPromise(options) {
    return new Promise(function(resolve, reject) {
        request(options, function(err, response, body) {
            if (err) {
                reject(err);
                return;
            }

            resolve(body);
        });
    });
}

module.exports = requestPromise;
