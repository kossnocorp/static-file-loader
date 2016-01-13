# static-file-loader
[![Build Status](https://travis-ci.org/kossnocorp/static-file-loader.svg?branch=master)](https://travis-ci.org/kossnocorp/static-file-loader)

Drop-in replacement for [file-loader](https://github.com/webpack/file-loader)
with the only difference: static-file-loader stores a map of original file names to
file names with hashes in the compilation stats:

``` json
{
  "/Users/koss/src/kossnocorp/static-file-loader/test/fixtures/static/a.gif": "/980d0a50ac153b475e9fb1b8ffe22619.gif",
  "/Users/koss/src/kossnocorp/static-file-loader/test/fixtures/static/b.gif": "/980d0a50ac153b475e9fb1b8ffe22619.gif",
  "/Users/koss/src/kossnocorp/static-file-loader/test/fixtures/static/c.gif": "/980d0a50ac153b475e9fb1b8ffe22619.gif"
}
```

It's helpful if you want to use webpack to pre-build static files and then
build HTML template using the paths map.

## Installation

```
npm install static-file-loader file-loader --save-dev
```

## Example

In an entry:

``` js
require.context('!!static-file!./static', true, /.+/)

// ...
```

Template:

``` erb
<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8' />
    <link rel='shortcut icon' href='<%= staticPath('favicon.png') %>' />
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

Development server:

``` js
// ...

var staticFilesPath = path.join(process.cwd(), 'static')
var publicPath = webpackConfig.output.publicPath

express()
  .use('/', express.static(staticFilesPath))
  .get('*', function(req, res) {
    var html = template({
      staticPath: function(staticFilePath) {
        return path.join(publicPath, staticFilePath)
      }
    })
    res.send(html)
  })
```

Production build script:

``` js
// ...

var staticMapKey = require('static-file-loader').key
var staticFilesPath = path.join(process.cwd(), 'assets')
var publicPath = webpackConfig.output.publicPath

webpack(webpackConfig).run(function(err, stats) {
  var staticMap = stats.compilation[staticMapKey]
  var html = template({
    staticPath: function(staticFilePath) {
      var processedStaticFilePath = staticMap[path.join(staticFilesPath, staticFilePath)]
      return path.join(publicPath, processedStaticFilePath)
    }
  })

  // ...
})
```

## License

MIT
