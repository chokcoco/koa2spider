const fs = require('fs');
const Koa = require('koa');
const app = new Koa();

function co(fn) {
    return function(done) {
        var ctx = this;
        var gen = fn.call(ctx);
        var it = null;
        function _next(err, res) {
            if(err) res = err;
            it = gen.next(res);
            //{value:function(){},done:false}
            if(!it.done){
                it.value(_next);
            }
        }
        _next();
    }
}

//一个 thunk 函数
function read(file) {
    return function(fn){
        fs.readFile(file, 'utf8', fn);
    }
}

co(function *(){
    var c = 2;
    console.log(c);
    var a = yield read('./.gitignore');
    console.log(a.length);

    var b = yield read('./package.json');
    console.log(b.length);
})();

app.listen(3030);