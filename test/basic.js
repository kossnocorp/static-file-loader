var assert = require('power-assert')
var sinon = require('sinon')
var rewire = require('rewire')
var rewireHelpers = require('rewire-test-helpers')
var staticFileLoader = rewire('../')
var staticFileLoaderKey = staticFileLoader.key

describe('basic tests', function() {
  var getContext = function(overrides) {
    overrides = overrides || {}
    var compilation = {}

    if (overrides.map) {
      compilation[staticFileLoaderKey] = overrides.map
    }

    return {
      emitFile: function() {},
      resource: '/a/b/c.png',
      _compilation: compilation,
      options: {
        output: {
          publicPath: '/bundles'
        }
      }
    }
  }

  rewireHelpers.injectDependenciesFilter(staticFileLoader, {
    fileLoader: function() {
      this.emitFile('abc.png', 'abc')
    }
  })

  it('do not throw an error when the map is not exists in the context', function() {
    assert.doesNotThrow(function() {
      staticFileLoader.call(getContext())
    })
  })

  it('adds a file to the map when the map is exists in the context', function() {
    var map = {a: 'a'}
    var context = getContext({map: map})
    staticFileLoader.call(context)
    assert(Object.keys(map).length == 2)
  })

  it('calls file-loader with passed arguments', function() {
    var fileLoader = sinon.spy()
    rewireHelpers.rewired(staticFileLoader, {fileLoader: fileLoader}, function() {
      staticFileLoader.call(getContext(), 'qwe')
      assert(fileLoader.calledWith('qwe'))
    })
  })

  it('calls file-loader with passed arguments and stores a file to the map', function() {
    var map = {}
    var context = getContext({map: map})
    staticFileLoader.call(context)
    assert(map['/a/b/c.png'] === '/bundles/abc.png')
  })


  it('restores the original emitFile function', function() {
    var context = getContext()
    var emitFile = context.emitFile
    staticFileLoader.call(context)
    assert(emitFile === context.emitFile)
  })

  it('returns file-loader result', function() {
    var fileLoader = function() { return 'asd' }
    rewireHelpers.rewired(staticFileLoader, {fileLoader: fileLoader}, function() {
      var result = staticFileLoader.call(getContext())
      assert(result === 'asd')
    })
  })

  it('sets raw = true to the export', function() {
    assert(staticFileLoader.raw)
  })
})
