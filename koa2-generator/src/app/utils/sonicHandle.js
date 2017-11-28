"use strict";

const stream = require("stream");
const zlib = require("zlib");
const differ = require("sonic_differ");

// gzip 压缩设置
const method = {
    gzip: zlib.createGzip,
    deflate: zlib.createDeflate
};

async function sonicHandle(ctx, next) {
    let body = ctx.body;

    if (!body) {
        return;
    }

    let encoding = ctx.acceptsEncodings("gzip", "deflate", "identity");

    if (!encoding) {
        ctx.throw(406, "supported encodings: gzip, deflate, identity");
    }

    if (encoding === "identity") {
        return;
    }
    if (ctx.response.length < 2048) {
        return;
    }

    ctx.set("Content-Encoding", encoding);
    ctx.res.removeHeader("Content-Length");

    let zip = (ctx.body = method[encoding]({
        flush: zlib.Z_SYNC_FLUSH
    }));

    zip.on("error", err => {
        console.info(err);
    });

    zip.on("finish", () => {
        console.info("zip succ");
        console.timeEnd("node time");
    });

    let sonic = {
        buffer: [],
        write: function(chunk, encoding) {
            let buffer = chunk;
            let ecode = encoding || "utf8";
            if (!Buffer.isBuffer(chunk)) {
                buffer = new Buffer(chunk, ecode);
            }
            sonic.buffer.push(buffer);
        }
    };

    function getDiff() {
        console.info("sonic 开始拦截返回数据");

        body.on("data", (chunk, encoding) => {
            // console.log('chunk', chunk);
            sonic.write(chunk, encoding);
        });

        body.on("end", () => {
            // sonic_differ 判断模版、数据块更新
            let result = differ(ctx, Buffer.concat(sonic.buffer));
            sonic.buffer = [];
            if (result.cache) {
                console.info("sonic 完全cache");
                zip.end();
            } else {
                console.info("sonic 非缓存模式");
                zip.end(result.data);
            }
            // console.log("\nresponse header: "+ JSON.stringify(ctx.response,'','\t'));
        });
    }

    try {
        // body instanceof stream ? body.pipe(zip) : zip.end(body);
        body instanceof stream ? (ctx.get("accept-diff") ? getDiff() : body.pipe(zip)) : zip.end(body);
        console.log("sonic Done");
        // getDiff();
    } catch (e) {
        console.info("zip error");
        console.error(e);
    }
}

module.exports = sonicHandle;
