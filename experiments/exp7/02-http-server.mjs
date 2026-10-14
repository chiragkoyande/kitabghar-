import { createServer } from 'node:http';

console.log('==================================================');
console.log('Kitab Ghar - HTTP Server Demonstration');
console.log('==================================================');

const PORT = 5007;

// Kitab Ghar sample data
const books = [
  { id: 1, title: 'Norwegian Wood', author: 'Haruki Murakami', category: 'Fiction' },
  { id: 2, title: 'Ikigai', author: 'Francesc Miralles and Hector Garcia', category: 'Self-Help' },
  { id: 3, title: 'The Alchemist', author: 'Paulo Coelho', category: 'Fiction' }
];

// Create HTTP server
const server = createServer((req, res) => {
  // Set default header
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'GET') {
    if (req.url === '/') {
      res.writeHead(200);
      res.end(JSON.stringify({ message: 'Welcome to Kitab Ghar API' }));
    } else if (req.url === '/books') {
      res.writeHead(200);
      res.end(JSON.stringify({ books }));
    } else if (req.url === '/health') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'ok', service: 'kitab-ghar-exp7' }));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Route not found' }));
    }
  } else {
    res.writeHead(405);
    res.end(JSON.stringify({ error: 'Method not allowed' }));
  }
});

// Start the server
server.listen(PORT, '127.0.0.1', async () => {
  console.log(`\n✅ Server started on http://127.0.0.1:${PORT}`);
  
  // Auto-test the endpoints to demonstrate it works
  try {
    console.log('\n--- Running Auto-Tests ---');
    
    let res = await fetch(`http://127.0.0.1:${PORT}/`);
    let data = await res.json();
    console.log(`GET /       -> Status: ${res.status} | Response:`, data);
    
    res = await fetch(`http://127.0.0.1:${PORT}/books`);
    data = await res.json();
    console.log(`GET /books  -> Status: ${res.status} | Response:`, data);
    
    res = await fetch(`http://127.0.0.1:${PORT}/health`);
    data = await res.json();
    console.log(`GET /health -> Status: ${res.status} | Response:`, data);
    
    res = await fetch(`http://127.0.0.1:${PORT}/unknown-route`);
    data = await res.json();
    console.log(`GET /unknown-> Status: ${res.status} | Response:`, data);
    
  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    // Close the server after demonstrating
    console.log('\n--- Closing Server ---');
    server.close(() => {
      console.log('Server closed successfully.');
    });
  }
});
