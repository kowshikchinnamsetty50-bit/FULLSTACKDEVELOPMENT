const http = require('http');
const fs = require('fs');
const path = require('path');

const PORTS = [5500, 3000];
const clients = new Set();

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Live reload client snippet
const LIVE_RELOAD_SCRIPT = `
<!-- Live Server Hot Reload -->
<script>
  (function() {
    try {
      const es = new EventSource('/__livereload');
      es.onmessage = function(e) {
        if (e.data === 'reload') {
          console.log('[LiveServer] Reloading...');
          window.location.reload();
        }
      };
      es.onerror = function() {
        setTimeout(() => new EventSource('/__livereload'), 2000);
      };
    } catch (e) {}
  })();
</script>
</body>
`;

// Watch directory for file edits
let debounceTimer = null;
try {
  fs.watch(__dirname, { recursive: true }, (eventType, filename) => {
    if (!filename || filename.includes('.git') || filename.includes('server.js')) return;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      console.log(`[LiveServer] Change detected in ${filename}, notifying clients...`);
      for (const res of clients) {
        try {
          res.write('data: reload\n\n');
        } catch (err) {
          clients.delete(res);
        }
      }
    }, 100);
  });
} catch (e) {
  console.log('[LiveServer] Watcher error:', e.message);
}

function handleRequest(req, res) {
  let reqPath = req.url.split('?')[0];

  // SSE Live Reload endpoint
  if (reqPath === '/__livereload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    res.write('data: connected\n\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }

  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const filePath = path.join(__dirname, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error: ' + err.code);
      }
      return;
    }

    if (ext === '.html') {
      let htmlStr = content.toString('utf8');
      if (htmlStr.includes('</body>')) {
        htmlStr = htmlStr.replace('</body>', LIVE_RELOAD_SCRIPT);
      } else {
        htmlStr += LIVE_RELOAD_SCRIPT;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(htmlStr);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
}

PORTS.forEach(port => {
  const srv = http.createServer(handleRequest);
  srv.listen(port, '0.0.0.0', () => {
    console.log(`Live Server active at http://localhost:${port}/ and http://127.0.0.1:${port}/`);
  });
  srv.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} in use, skipping...`);
    }
  });
});
