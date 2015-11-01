var fileLoader = require('file-loader')
var path = require('path')

var MAP_KEY = '__public_loader_map__'

module.exports = function(content)  {
  const originEmitFile = this.emitFile
  const map = this._compilation[MAP_KEY] = this._compilation[MAP_KEY] || {}

  // Override emitFile function to get an url from file-loader
  this.emitFile = (url, fileContent) => {
    map[this.resource] = path.join(this.options.output.publicPath || '/', url)
    originEmitFile.call(this, url, fileContent)
  }

  // Call file-loader and store the result
  const result = fileLoader.call(this, content)

  // Restore emitFile function
  this.emitFile = originEmitFile

  return result
}

module.exports.raw = true
module.exports.key = MAP_KEY
