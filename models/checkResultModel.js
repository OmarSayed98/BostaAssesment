const mongoose = require('mongoose');
const schema = mongoose.Schema;

const checkResultSchema = new schema({
    checkId: {
        type: mongoose.Types.ObjectId,
        ref: 'Check'
    },
    status: {type:Boolean, default: true},
    availability: {type: Number, default: 100},
    outage: {type: Number, default: 0},
    downtime: {type: Number, default: 0},
    uptime: {type: Number, default: 0},
    responseTime: {type: Number, default: 0},
    numberOfConsecutiveFailures: {type: Number, default:0},


}, {timestamps: true});

const checkResultModel = mongoose.model('Check Result', checkResultSchema);

module.exports = checkResultModel;