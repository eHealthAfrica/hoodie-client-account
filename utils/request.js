module.exports = request

var nets = require('nets')
var set = require('lodash.set')

var Promise = require('./promise')

function request (options) {
  options.encoding = undefined

  return new Promise(function (resolve, reject) {
    set(options, 'headers.accept', 'application/vnd.api+json')
    set(options, 'headers.content-type', 'application/vnd.api+json')
    options.json = true
    if (options.body) {
      // works around an issue where nets-xhr stringifies options.json
      // if it is truthy, which overides options.body
      options.json = options.body
    }
    nets(options, function (error, response) {
      if (error) {
        return reject(error)
      }

      if (response.statusCode >= 400) {
        error = new Error(response.body.errors[0].detail)
        error.name = response.body.errors[0].title + 'Error'
        error.statusCode = parseInt(response.body.errors[0].status, 10)
        return reject(error)
      }

      resolve(response)
    })
  })
}
