const mongoose = require('mongoose');
const schema = mongoose.Schema;

const verificationHashSchema = new schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    Hash: String
}, {timestamps: true});

const verificationHashModel = mongoose.model('Verification Hash', verificationHashSchema);

module.exports = verificationHashModel;