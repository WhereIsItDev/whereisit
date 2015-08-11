var Logger = require('le_node');
var config = require('./config');

var log = new Logger({
  token: config.LE_TOKEN,
  console: true
});

module.exports = log;
