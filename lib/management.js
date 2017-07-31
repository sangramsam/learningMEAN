var cookie = require('cookie');
var User = require('../model/user')

function setCookies(key, value, host) {
    if (typeof  value === 'number')
        value = value.toString();
    if (typeof value === 'object') {
        value = value.stringify(value);
    }
    return cookie.serialize(key, value, {
        maxAge: 3600 * 1000 * 24 * 365,
        path: '/',
        domain: host
    });

}


module.exports = {
    setCookies: setCookies
}