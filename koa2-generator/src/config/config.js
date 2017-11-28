"use strict";
const path = require("path");

let config = {
    env: (process.env.NODE_ENV = process.env.NODE_ENV || "development"),
    test: {
        GET_PAY_DATA_URL: "http://1.tv.aiseet.atianqi.com/ktweb/pay/tvpay/getPayData"
    },
    development: {
        GET_PAY_DATA_URL: "http://tv.aiseet.atianqi.com/ktweb/pay/tvpay/getPayData"
    }
};

module.exports = config;
