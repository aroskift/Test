const sha512 = require('sha512');

module.exports = {
  hash: str => sha512(str).toString('hex')
};