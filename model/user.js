const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/connect');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    auth_token: {
        type: String
    },
    modified: {
        type: String
    }
});
const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
}
module.exports.getUserByName = function (userName, callback) {
    const query = {username: userName}
    User.findOne(query, callback);

}
module.exports.getUserByEmail = function (email, callback) {
    const query = {email: email}
    User.findOne(query, callback);

}

module.exports.addUser = function (newuser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newuser.password, salt, function (err, hash) {
            if (err) throw  err;
            newuser.password = hash;
            newuser.save(callback);
        });
    })
}
module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}

