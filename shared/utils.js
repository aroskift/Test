const sha512 = require('sha512'); // SHA512 hashing implementation for JavaScript (we need "some" security) 

module.exports = {
  hash: str => sha512(str).toString('hex')
};