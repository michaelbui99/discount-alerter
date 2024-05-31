const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const [from, to] = args;

fs.copyFileSync(path.resolve(from), path.resolve(to));

