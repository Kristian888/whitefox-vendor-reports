const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Parse URL
    const url = req.url === '/' ? '/index.html' : req.url;
    
    // Handle query parameters
    if (url.includes('?')) {
        const [pathname] = url.split('?');
        filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
    } else {
        filePath = path.join(__dirname, url === '/' ? 'index.html' : url);
    }
    
    // Get file extension
    const ext = path.extname(filePath).toLowerCase();
    
    // Content types
    const contentTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.pdf': 'application/pdf',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.mp4': 'video/mp4',
        '.otf': 'font/otf',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2'
    };
    
    const contentType = contentTypes[ext] || 'text/plain';
    
    // Read and serve file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File not found, serve index.html for SPA routing
                fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
                    if (err) {
                        res.writeHead(500);
                        res.end('Server Error');
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf8');
                });
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + err.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});