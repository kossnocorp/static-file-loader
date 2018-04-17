var assert = require('power-assert')
var fs = require('fs')
var path = require('path')
var staticFileLoaderKey = require('../').key
var webpack = require('webpack')
var rmrf = require('rimraf')
const handleError = (err, stats) => {
  if (err) {
    throw err
  }
  const info = stats.toJson()
  if (stats.hasErrors()) {
    for (const error of info.errors) {
      console.error(error)
    }
    throw new Error('error during webpack build')
  }
  if (stats.hasWarnings()) {
    for (const warning of info.warnings) {
      console.warn(warning)
    }
  }
}

describe('integration tests', function () {
  beforeEach(function () {
    fs.symlinkSync(process.cwd(), path.join(process.cwd(), 'node_modules', 'static-file-loader'))
  })

  afterEach(function (done) {
    fs.unlinkSync(path.join(process.cwd(), 'node_modules', 'static-file-loader'))
    rmrf(path.join(__dirname, 'dist'), done)
  })

  context('when publicPath is specified', function () {
    it('stores files map in the compilation stats', function (done) {
      var compiler = webpack({
        mode: 'production',
        context: __dirname,
        entry: './fixtures/index.js',
        output: {
          path: path.join(__dirname, '/dist'),
          filename: 'bundle.js',
          publicPath: '/bundles'
        }
      })
      compiler.run(function (err, stats) {
        handleError(err, stats)
        var staticFiles = stats.compilation[staticFileLoaderKey]
        var fileNames = Object.keys(staticFiles)
        assert.deepEqual(fileNames.sort(), [
          path.join(__dirname, 'fixtures', 'static', 'a.gif'),
          path.join(__dirname, 'fixtures', 'static', 'b.gif'),
          path.join(__dirname, 'fixtures', 'static', 'c.gif')
        ])
        fileNames.forEach(function (fileName) {
          assert(staticFiles[fileName].match(/\/bundles\/\w+.gif$/))
        })
        done()
      })
    })
  })

  context('when publicPath is not specified', function () {
    it('stores files map in the compilation stats', function (done) {
      var compiler = webpack({
        mode: 'production',
        context: __dirname,
        entry: './fixtures/index.js',
        output: {
          path: path.join(__dirname, '/dist'),
          filename: 'bundle.js'
        }
      })
      compiler.run(function (err, stats) {
        handleError(err, stats)
        var staticFiles = stats.compilation[staticFileLoaderKey]
        var fileNames = Object.keys(staticFiles)
        assert.deepEqual(fileNames.sort(), [
          path.join(__dirname, 'fixtures', 'static', 'a.gif'),
          path.join(__dirname, 'fixtures', 'static', 'b.gif'),
          path.join(__dirname, 'fixtures', 'static', 'c.gif')
        ])
        fileNames.forEach(function (fileName) {
          assert(staticFiles[fileName].match(/\/\w+.gif$/))
        })
        done()
      })
    })
  })
})
