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

  context('when publicPath is specified', function() {
    it('stores files map in the compilation stats', function(done) {
      var compiler = webpack({
        context: __dirname,
        entry: './fixtures/index.js',
        output: {
          path: path.join(__dirname, '/dist'),
          filename: 'bundle.js',
          publicPath: '/bundles'
        }
      })
      compiler.run(function(err, stats) {
        var publicFiles = stats.compilation[publicLoaderKey]
        var fileNames = Object.keys(publicFiles)
        assert.deepEqual(fileNames.sort(), [
          path.join(__dirname, 'fixtures', 'public', 'a.gif'),
          path.join(__dirname, 'fixtures', 'public', 'b.gif'),
          path.join(__dirname, 'fixtures', 'public', 'c.gif')
        ])
        fileNames.forEach(function(fileName) {
          assert(publicFiles[fileName].match(/\/bundles\/\w+.gif$/))
        })
        done()
      })
    })
  })

  context('when publicPath is not specified', function() {
    it('stores files map in the compilation stats', function(done) {
      var compiler = webpack({
        context: __dirname,
        entry: './fixtures/index.js',
        output: {
          path: path.join(__dirname, '/dist'),
          filename: 'bundle.js'
        }
      })
      compiler.run(function(err, stats) {
        var publicFiles = stats.compilation[publicLoaderKey]
        var fileNames = Object.keys(publicFiles)
        assert.deepEqual(fileNames.sort(), [
          path.join(__dirname, 'fixtures', 'public', 'a.gif'),
          path.join(__dirname, 'fixtures', 'public', 'b.gif'),
          path.join(__dirname, 'fixtures', 'public', 'c.gif')
        ])
        fileNames.forEach(function(fileName) {
          assert(publicFiles[fileName].match(/\/\w+.gif$/))
        })
        done()
      })
    })
  })
})
