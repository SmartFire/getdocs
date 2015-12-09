var fs = require("fs")

var getdocs = require("../src")

fs.readdirSync(__dirname).forEach(function(filename) {
  var isJSON = /^([^\.]+)\.json$/.exec(filename)
  if (!isJSON) return
  
  var expected = JSON.parse(fs.readFileSync(__dirname + "/" + filename, "utf8"))
  var jsfile = "/" + isJSON[1] + ".js"
  var returned = getdocs.gather(fs.readFileSync(__dirname + jsfile, "utf8"), "test" + jsfile)
  try {
    compare(returned, expected, "")
  } catch(e) {
    console.error(isJSON[1] + ": " + e.message)
    console.error("in " + JSON.stringify(returned, null, 2))
  }
})

function compare(a, b, path) {
  if (typeof a != "object" || typeof b != "object") {
    if (a !== b) throw new Error("Mismatch at " + path)
  } else {
    for (var prop in a) if (a.hasOwnProperty(prop)) {
      if (!b.hasOwnProperty(prop))
        throw new Error("Unexpected property " + path + "." + prop)
      else
        compare(a[prop], b[prop], path + "." + prop)
    }
    for (var prop in b) if (b.hasOwnProperty(prop)) {
      if (!a.hasOwnProperty(prop))
        throw new Error("Missing property " + path + "." + prop)
    }
  }
}