const path = require('path');
const fs = require('fs');
const pug = require('pug');

const root = path.resolve(__dirname, '..', '..');
const pagePath = path.join(root, 'src', 'page');
const publicPath = path.join(root, 'public');

pug.renderFile(
    path.join(pagePath, 'index.pug'),
    {},
    (err, html) => {
      if (err) {
        throw err;
      }
      fs.writeFileSync(path.join(publicPath, 'index.html'), html);
    },
)
