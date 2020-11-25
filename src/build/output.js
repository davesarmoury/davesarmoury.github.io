const fs = require('fs/promises');
const pug = require('pug');

const output = (inputPug, data, outputHtml) => {
  return new Promise((resolve, reject) => {
    const onPugRendered = (err, html) => {
      if (err) {
        return reject(err);
      }

      return resolve(fs.writeFile(outputHtml, html, 'utf-8'));
    };

    pug.renderFile(inputPug, data, onPugRendered);
  });
};

module.exports = {
  output,
};
