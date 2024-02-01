const MyErr = require('./MyError');

class NotFoundError extends MyErr {}

module.exports = NotFoundError;
