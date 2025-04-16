const http = require('http');
const fs = require('fs');
const split2 = require('split2');
const through2 = require('through2');

const host = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    const results = [];
    let headers = [];

    fs.createReadStream('./data.csv')
      .pipe(split2())
      .pipe(through2.obj(function (line, _, next) {
        if (!headers.length) {
          headers = line.split(',');
        } else {
          const values = line.split(',');
          const obj = {};
          headers.forEach((key, index) => {
            obj[key] = values[index];
          });
          results.push(obj);
        }
        next();
      }))
      .on('finish', () => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(results));
      })
      .on('error', err => {
        res.writeHead(500);
        res.end('Server Error: ' + err.message);
      });

  } else {
    res.writeHead(405);
    res.end('Only GET requests are supported');
  }
});

server.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`);
});
