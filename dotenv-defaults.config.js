// Alternative entrypoint for `./dotenv-defaults.js` that will automatically
// call `config()` when imported. Needed for ES6 environments.

require('./dotenv-defaults').config()
