var express = require('express');
var router = express.Router();
var lib = require('../lib/management');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const config = require('../config/connect');
;

/* GET home page. */


router.get('/', function (req, res, next) {


    res.render('index', {title: "tests"});
});
router.post('/register', function (req, res, next) {

    var newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        auth_token: null,
        modified: new Date()
    });

    User.addUser(newUser, function (err, user) {

        if (err) {
            res.json({success: false, mesg: 'fail to register user'});
        } else {
            res.json({success: true, mesg: 'User Registered Successfully'});
        }
    });

});
router.post('/authenticate', function (req, res, next) {
    var token = null;
    //console.log(req.headers.token);

    const username = req.body.username;
    const password = req.body.password;
    var host = req.hostname;
    User.getUserByName(username, function (err, user) {
        if (err) throw err;
        if (!user) {
            return res.json({succeess: false, mesg: 'User not found'});
        }
        User.comparePassword(password, user.password, function (err, isMatch) {
            if (isMatch) {
                User.findOne({username: username}, function (err, docs) {
                    // console.log("token", docs);
                    if (docs.auth_token === null) {
                        token = jwt.sign(user, config.secret, {
                            expiresIn: 604
                        });
                        console.log("new Token" + token)
                        User.getUserByName(username, function (err, newUser) {
                            newUser.auth_token = token;
                            newUser.modified = new Date();
                            newUser.save(function (error, todo) {
                                if (error) throw error;
                            })
                        })
                    }
                    else {
                        token = docs.auth_token;
                    }
                    var cookies = [];
                    cookies.push(lib.setCookies("auth_token", token, host));
                    res.header('Set-Cookie', cookies);
                    res.json({
                        success: true,
                        token: token,
                        user: {
                            id: user._id,
                            name: user.name,
                            username: user.username,
                            email: user.email
                        }
                    });
                })
            } else {
                return res.json({success: false, mesg: 'Wrong password'});
            }
        });


    });
});
router.get('/profile', isAuthenticated, function (req, res, next) {
    //console.log(req);
    res.json({success: true});
});
router.get('/logout', function (req, res, next) {
    User.findOne({auth_token: req.cookies.auth_token}, function (err, data) {
        console.log(data);
        data.auth_token = null;
        data.save(function (err, done) {
            console.log(done);
        });
    })
    //console.log(req.cookies);
    res.clearCookie('auth_token');
    res.jsonp({
        success: true
    })
    ;
});
function isAuthenticated(req, res, next) {
    User.findOne({auth_token: req.headers.token}, function (err, data) {
        if (err) {

        }
        else {
            if (data === null) {
                res.status(402);
                res.jsonp({sucess: "Not authorized"});
            } else {
                console.log("authentication", data);
                return next();
            }
        }
    });

}
module.exports = router;
