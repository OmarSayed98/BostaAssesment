const mongoose = require('mongoose');
const schema = mongoose.Schema;

const checkSchema = new schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    name: {type: String, required: true},
    url: {type: String, required: true, unique: true},
    protocol: {
        type: String,
        enum: [
            'HTTP',
            'HTTPS',
            'TCP'
        ],
        required: true
    },
    timeout: {type: Number, default: 5},
    interval: {type: Number, default: 10},
    threshold: {type: Number, default: 1},
    authentication: {username: String, password: String},
    httpHeaders: [{
        key: String,
        value: String
    }],
    tags: [String],
    ignoreSSL: {type: Boolean, required: true},
}, {timestamps: true});
const checkModel = mongoose.model('Check', checkSchema);

module.exports = checkModel;

