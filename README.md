# public-loader

Drop-in replacement for [file-loader](https://github.com/webpack/file-loader)
with the only difference: public-loader stores a map of original file names to
file names with hashes in the compilation stats:

``` json
{
  "/Users/koss/src/kossnocorp/public-loader/test/fixtures/public/a.gif": "980d0a50ac153b475e9fb1b8ffe22619.gif",
  "/Users/koss/src/kossnocorp/public-loader/test/fixtures/public/b.gif": "980d0a50ac153b475e9fb1b8ffe22619.gif",
  "/Users/koss/src/kossnocorp/public-loader/test/fixtures/public/c.gif": "980d0a50ac153b475e9fb1b8ffe22619.gif"
}
```

It's helpful if you want to use webpack to pre-build static files and then
build HTML template using the assets map.

## Installation

```
npm install public-loader file-loader --save-dev
```

## Example

In an entry:

``` js
require.context('!!public!./assets', true, /.+/)

// ...
```

Template:

``` erb
<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8' />
    <link rel='shortcut icon' href='<%= assetPath('/assets/favicon.png') %>' />
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

Development server:

``` js
// ...

var assetsPath = path.join(process.cwd(), 'assets')

express()
  .use('/assets', express.static(assetsPath))
  .get('*', function(req, res) {
    var html = template({
      assetPath: function(pth) {
        return pth
      }
    })
    res.send(html)
  })
```

Production build script:

``` js
var publicMapKey = require('public-loader').key

// ...

var assetsPath = path.join(process.cwd(), 'assets')

webpack(webpackConfig).run(function(err, stats) {
  var publicMap = stats.compilation[publicMapKey]
  var html = template({
    assetPath: function(pth) {
      var exportedPath = assetsMap[path.join(assetsPath, pth)]
      return stats.compilation.options.output.publicPath + exportedPath
    }
  })

  // ...
})
```

## License

MIT
