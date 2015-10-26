var fileLoader = require('file-loader')

var MAP_KEY = '__public_loader_map__'

module.exports = function(content) {
  var originEmitFile = this.emitFile
  var bindedEmitFile = originEmitFile.bind(this)
  var map = this._compilation[MAP_KEY] = this._compilation[MAP_KEY] || {}
  var resource = this.resource

  // Override emitFile function to get an url from file-loader
  this.emitFile = function(url, fileContent) {
    map[resource] = url
    bindedEmitFile(url, fileContent)
  }

  // Call file-loader and store the result
  var result = fileLoader.call(this, content)

  // Restore emitFile function
  this.emitFile = originEmitFile

  return result
}

module.exports.raw = true

module.exports.key = MAP_KEY
