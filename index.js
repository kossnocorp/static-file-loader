var fileLoader = require('file-loader')
var path = require('path')

var MAP_KEY = '__static_loader_map__'

module.exports = function (content) {
  var originEmitFile = this.emitFile
  var map = this._compilation[MAP_KEY] = this._compilation[MAP_KEY] || {}

  // Override emitFile function to get an url from file-loader
  this.emitFile = function (url, fileContent) {
    map[this.resource] = path.join(this._compiler.options.output.publicPath || '/', url)
    originEmitFile.call(this, url, fileContent)
  }.bind(this)

  // Call file-loader and store the result
  var result = fileLoader.call(this, content)

  // Restore emitFile function
  this.emitFile = originEmitFile

  return result
}

module.exports.raw = true
module.exports.key = MAP_KEY
