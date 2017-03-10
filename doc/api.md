## 上报协议

- URl：http://172.26.17.3:3010/report
- params：
    - reportType：{Number} 1 - 任务体系，2 - 碎钻商城
    - reportValue： {String} 接口URL

## 查询数据

- URl：http://172.26.17.3:3010/request
- params：
    - requestType：{Number} 1 - 任务体系，2 - 碎钻商城
    - requestDate：{String} 查询日期 2017-03-11

- response：
    - result: {Boolean} 1 - 查询正确，0 - 错误
    - info: {
        errorAllCount: {Number} 请求接口总数量
        eachHour: {Array} [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] 每个时间段的错误数量
        eachURlError: [{
            path: 'http://api.ys.m.yy.com/api/public/weeklyMall/queryHouNobleUserList.json',
            count: 5
        },{
            path: 'http://api.ys.m.yy.com/api/internal/noble/qryNobleIdentity.json',
            count: 4
        }]
    }