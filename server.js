const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT ? Number(process.env.PORT) : 5173;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8'
};

function send404(res) {
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('404 Not Found');
}

function send500(res) {
  res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('500 Internal Server Error');
}

const server = http.createServer((req, res) => {
  try {
    const requestUrl = new URL(req.url, `http://${req.headers.host}`);
    let pathname = decodeURIComponent(requestUrl.pathname);

    if (pathname === '/') {
      pathname = '/index.html';
    }

    const filePath = path.normalize(path.join(ROOT, pathname));

    if (!filePath.startsWith(ROOT)) {
      send404(res);
      return;
    }

    fs.stat(filePath, (statErr, stats) => {
      if (statErr) {
        send404(res);
        return;
      }

      if (stats.isDirectory()) {
        const indexPath = path.join(filePath, 'index.html');
        fs.readFile(indexPath, (indexErr, buffer) => {
          if (indexErr) {
            send404(res);
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(buffer);
        });
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      fs.readFile(filePath, (readErr, buffer) => {
        if (readErr) {
          send500(res);
          return;
        }

        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache'
        });
        res.end(buffer);
      });
    });
  } catch (err) {
    send500(res);
  }
});

server.listen(PORT, () => {
  console.log(`Site running at http://localhost:${PORT}`);
});
