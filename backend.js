const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const DATA_FILE = 'entries.json';
const PORT = process.env.PORT || 3000;

// Utility functions
function readEntries() {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (err) {
    console.error('Error reading entries:', err);
    return [];
  }
}

function writeEntries(entries) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2));
  } catch (err) {
    console.error('Error writing entries:', err);
  }
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

// CORS headers
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
}

// Request handler
const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  try {
    // GET /api/entries - Get all entries
    if (pathname === '/api/entries' && req.method === 'GET') {
      const entries = readEntries();
      res.writeHead(200);
      res.end(JSON.stringify(entries));
      return;
    }

    // POST /api/entries - Add new entry
    if (pathname === '/api/entries' && req.method === 'POST') {
      const body = await parseBody(req);
      const entries = readEntries();

      const newEntry = {
        id: Date.now().toString(),
        address: body.address || '',
        latitude: body.latitude || null,
        longitude: body.longitude || null,
        description: body.description || '',
        entryDate: body.entryDate || new Date().toISOString().split('T')[0],
        treated: body.treated || false,
        treatmentDate: body.treatmentDate || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      entries.push(newEntry);
      writeEntries(entries);

      res.writeHead(201);
      res.end(JSON.stringify(newEntry));
      return;
    }

    // PATCH /api/entries/:id - Update entry
    if (pathname.startsWith('/api/entries/') && req.method === 'PATCH') {
      const id = pathname.split('/').pop();
      const body = await parseBody(req);
      const entries = readEntries();

      const index = entries.findIndex(e => e.id === id);
      if (index === -1) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Entry not found' }));
        return;
      }

      entries[index] = {
        ...entries[index],
        ...body,
        id: entries[index].id, // Keep original ID
        createdAt: entries[index].createdAt,
        updatedAt: new Date().toISOString()
      };

      writeEntries(entries);

      res.writeHead(200);
      res.end(JSON.stringify(entries[index]));
      return;
    }

    // DELETE /api/entries/:id - Delete entry
    if (pathname.startsWith('/api/entries/') && req.method === 'DELETE') {
      const id = pathname.split('/').pop();
      let entries = readEntries();

      const index = entries.findIndex(e => e.id === id);
      if (index === -1) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Entry not found' }));
        return;
      }

      entries = entries.filter(e => e.id !== id);
      writeEntries(entries);

      res.writeHead(200);
      res.end(JSON.stringify({ success: true }));
      return;
    }

    // GET / - Serve index.html
    if (pathname === '/' && req.method === 'GET') {
      try {
        const html = fs.readFileSync('index.html', 'utf8');
        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        res.end(html);
        return;
      } catch (err) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'index.html not found' }));
        return;
      }
    }

    // Default 404
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));

  } catch (err) {
    console.error('Error:', err);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
});

server.listen(PORT, () => {
  console.log(`Location Tracker running on http://localhost:${PORT}`);
  console.log(`Data file: ${DATA_FILE}`);
});
