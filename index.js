/*!
* generic-cookie-parser
* MIT Licensed
*/

/**
* Module dependencies.
*/
var cookie = require('cookie');
var parse = require('./lib/parse');

/**
 * Parse Cookie header and populate `req.cookies`
 * with an object keyed by the cookie names.
 *
 * @param {String} [secret]
 * @param {Object} [options]
 * @return {Function}
 * @api public
 */
module.exports = function createParser(secret, options) {
  return function parser(cookieString, callback) {
    var cookies = {};
    var signedCookies = {};

    if (cookies) {
      try {
        cookies = cookie.parse(cookieString, options);
        if (secret) {
          signedCookies = parse.signedCookies(cookies, secret);
          signedCookies = parse.JSONCookies(signedCookies);
        }

        cookies = parse.JSONCookies(cookies);
      } catch (err) {
        if(typeof callback === 'function') {
          return callback(err, {}, {});
        }
      }
    }

    if(typeof callback === 'function') {
      return callback(null, cookies, signedCookies);
    }
  };
};
