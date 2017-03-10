import mongoose from 'mongoose';

/**
 * Schema：一种以文件形式存储的数据库模型骨架，不具备数据库的操作能力
 */
const Schema = mongoose.Schema;

const reportSchame = new Schema({
    reportType: String,
    reportValue: String,
    reportDate: String
});

export default {
    db: null,
    /**
     * Model ：由Schema发布生成的模型，具有抽象属性和行为的数据库操作对
     */
    WatchReport: mongoose.model('WatchReport', reportSchame),
    /**
     * link to db
     */
    connect() {
        mongoose.connect('mongodb://localhost/httpHijack');
    }
}