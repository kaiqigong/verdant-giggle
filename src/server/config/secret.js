const secret = require('./secret.' + process.env.NODE_ENV) || {};
export default secret;
