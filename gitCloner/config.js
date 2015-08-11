var config = {};

if (process.env.NODE_ENV === 'prod') {
  config.LE_TOKEN = '6b18525b-4899-4a69-bf2c-714645a9554b'
} else {
  config.LE_TOKEN = '5df84de4-2596-48ad-923d-42a21d0343fb';
}

module.exports = config
