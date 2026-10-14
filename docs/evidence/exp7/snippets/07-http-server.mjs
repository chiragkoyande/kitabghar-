
const server = createServer((request, response) => { response.writeHead(200, { "Content-Type": "application/json" }); response.end(JSON.stringify({ service: "kitab-ghar-exp7", path: request.url, status: "ok" })); });
server.listen(0, "127.0.0.1"); await once(server, "listening");
const port = server.address().port;
const httpResponse = await fetch(`http://127.0.0.1:${port}/kitab-ghar/health`).then((response) => response.json());