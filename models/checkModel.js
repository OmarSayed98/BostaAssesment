const mongoose = require('mongoose');
const schema = mongoose.Schema;

const checkSchema = new schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    name: {type: String, required: true},
    url: {type: String, required: true},
    protocol: {
        type: String,
        enum: [
            'HTTP',
            'HTTPS',
            'TCP'
        ],
        required: true
    },
    path: String,
    port: {
        type: Number,
        min: 0,
        max: 65535,
    },
    webhook: String,
    timeout: {type:Number, default: 5},
    interval: {type:Number, default: 10},
    threshold: {type: Number, default: 1},
    authentication: {username: String, password: String},
    httpHeaders: [{
        key: String,
        value: String
    }],
    assert: Number,
    tags: [String],
    ignoreSSL: {type: Boolean, required: true},
});
const checkModel = mongoose.model('Check', checkSchema);

module.exports = checkModel;

