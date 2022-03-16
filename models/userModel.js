const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    email: String,
    password: String,
    name: String,
    active: {type: Boolean, default: false}
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;