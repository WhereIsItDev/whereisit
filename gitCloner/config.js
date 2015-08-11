var config = {};

var isProd = process.env.NODE_ENV === 'prod';
var isDev = !isProd;

if (isProd) {
  config.LE_TOKEN = 'b9d62caf-ba48-4151-84b8-a1a2f957f51a'
} else {
  config.LE_TOKEN = '681b893c-144f-479f-8442-4354db192afd';
}

module.exports = config
