const BOX_TYPE = {
    'OPEN': 1, //开通VIP
    'UPGRADE': 2, //升级
    'SINGLEPAY': 3, //单片
    'ACT': 4, //活动
    'TRANSFER': 5, //迁移
    'FORBID': 6, //禁止付费
    'DJ': 7, //开通鼎级剧场
};
const PAGE_TYPE = {
    'PRIME': 1, //普通开通页面
    'SINGLEPAY': 2, //单片页面
    'TICKET': 3 //用券页面
};
const GET_PAY_DATA_URL = 'http://1.tv.aiseet.atianqi.com/ktweb/pay/tvpay/getPayData';

module.exports = {
    BOX_TYPE: BOX_TYPE,
    PAGE_TYPE: PAGE_TYPE,
    GET_PAY_DATA_URL:GET_PAY_DATA_URL,
}