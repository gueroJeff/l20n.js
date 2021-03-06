var path = require('path');
var fs = require('fs');
var copy = require('dryice').copy;

function removeAmdefine(src) {
  src = String(src).replace(
    /if\s*\(typeof\s*define\s*!==\s*'function'\)\s*{\s*var\s*define\s*=\s*require\('amdefine'\)\(module\);\s*}\s*/g,
    '');
  src = src.replace(
    /\b(define\(.*)('amdefine',?)/gm,
    '$1');
  return src;
}
removeAmdefine.onRead = true;

function buildBrowser() {
  console.log('\nCreating dist/l20n.js');

  var project = copy.createCommonJsProject({
    roots: [ path.join(__dirname, '..', 'lib') ]
  });

  copy({
    source: [
      'build/almond.js',
      {
        project: project,
        require: ['l20n/bindings/html']
      },
     'build/browser.js'
    ],
    filter: [
      copy.filter.moduleDefines,
      removeAmdefine
    ],
    dest: 'dist/l20n.js'
  });
}

function buildBrowserMin() {
  console.log('\nCreating dist/l20n.min.js');

  copy({
    source: 'dist/l20n.js',
    filter: copy.filter.uglifyjs,
    dest: 'dist/l20n.min.js'
  });
}

function ensureDir(name) {
  var dirExists = false;
  try {
    dirExists = fs.statSync(name).isDirectory();
  } catch (err) {}

  if (!dirExists) {
    fs.mkdirSync(name, 0777);
  }
}

ensureDir("dist");
buildBrowser();
buildBrowserMin();
