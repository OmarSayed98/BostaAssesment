const mongoose = require('mongoose');
const schema = mongoose.Schema;

const verificationHashSchema = new schema({
    userId: String,
    Hash: String
});

const verificationHashModel = mongoose.model('Verification Hash', verificationHashSchema);

module.exports = verificationHashModel;