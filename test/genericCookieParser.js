
var cookieParser = require('..')
var should = require('should');
var assert = require('assert');
var signature = require('cookie-signature')

describe('generic-cookie-parser', function() {
  var parser;
  before(function() {
    parser = createParser();
  })

  describe('when no cookies are sent', function() {
    it('cookies should be {}', function(done) {
      parser('', function(err, cookies, signedCookies) {
        should.not.exist(err);
        cookies.should.be.empty;
        done();
      });
    });

    it('should default signedCookies to {}', function(done) {
      parser('', function(err, cookies, signedCookies) {
        should.not.exist(err);
        signedCookies.should.be.empty;
        done();
      });
    });
  });

  describe('when cookies are sent', function() {
    it('should populate cookies', function(done) {
      parser('foo=bar; bar=baz', function(err, cookies, signedCookies) {
        should.not.exist(err);
        assert.deepEqual(cookies, { foo: 'bar', bar: 'baz' });
        done();
      });
    })
  })

  describe('when a secret is given', function(){
    var val = signature.sign('foobarbaz', 'keyboard cat');
    // TODO: "bar" fails...

    it('should populate signedCookies', function(done){
      parser('foo=s:' + val, function(err, cookies, signedCookies) {
        should.not.exist(err);
        assert.deepEqual(signedCookies, { foo: 'foobarbaz' });
        done();
      });
    })

    it('should remove the signed value from cookies', function(done) {
      parser('foo=s:' + val, function(err, cookies, signedCookies) {
        console.log(cookies, signedCookies);
        should.not.exist(err);
        cookies.should.be.empty;
        done();
      });
    })

    it('should omit invalid signatures', function(done){
      parser('foo=s:' + val + '3', function(err, cookies, signedCookies) {
        should.not.exist(err);
        assert.deepEqual(cookies, { foo: 's:foobarbaz.CP7AWaXDfAKIRfH49dQzKJx7sKzzSoPq7/AcBBRVwlI3' });
        done();
      });
    })
  })
})

function createParser() {
  return cookieParser('keyboard cat');
}