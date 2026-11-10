const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3003;

const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, 'index.html');
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server Error');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`[Q15 React Greeting App] Running at http://localhost:${PORT}`);
});
