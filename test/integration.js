var assert = require('power-assert')
var fs = require('fs')
var path = require('path')
var publicLoaderKey = require('../').key
var webpack = require('webpack')
var rmrf = require('rimraf')

describe('integration tests', function() {
  beforeEach(function() {
    fs.symlinkSync(process.cwd(), path.join(process.cwd(), 'node_modules', 'public-loader'))
  })

  afterEach(function(done) {
    fs.unlinkSync(path.join(process.cwd(), 'node_modules', 'public-loader'))
    rmrf(path.join(__dirname, 'dist'), done)
  })

  it('stores files map in the compilation stats', function(done) {
    var compiler = webpack({
      context: __dirname,
      entry: './fixtures/index.js',
      output: {
      path: __dirname + "/dist",
        filename: "bundle.js"
      }
    })
    compiler.run(function(err, stats) {
      var map = stats.compilation[publicLoaderKey]
      assert.deepEqual(Object.keys(map), [
        path.join(__dirname, 'fixtures', 'public', 'a.gif'),
        path.join(__dirname, 'fixtures', 'public', 'b.gif'),
        path.join(__dirname, 'fixtures', 'public', 'c.gif')
      ])
      assert(map[path.join(__dirname, 'fixtures', 'public', 'a.gif')].match(/\w+.gif/))
      done()
    })
  })
})
