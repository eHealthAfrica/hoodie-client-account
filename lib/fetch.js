module.exports = fetch

var get = require('lodash.get')
var merge = require('lodash.merge')
var set = require('lodash.set')

var internals = module.exports.internals = {}
internals.fetchProperties = require('../utils/fetch-properties')
internals.saveSession = require('../utils/save-session')

function fetch (state, path) {
  return internals.fetchProperties({
    url: state.baseUrl + '/session/account',
    bearerToken: get(state, 'session.id'),
    path: path
  })

  .then(function (properties) {
    if (typeof path === 'string') {
      set(state.session.account, path, properties)
    } else {
      merge(state.session.account, properties)
    }

    internals.saveSession({
      cacheKey: state.cacheKey,
      session: state.session
    })

    return properties
  })
}
