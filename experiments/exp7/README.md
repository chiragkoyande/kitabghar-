# Experiment 7 — Node.js Core Applications

## College Requirement

Develop basic Node.js applications demonstrating: REPL, HTTP Server, File System, Buffers, Streams, and Event Loop.

## Script Structure

Each Node.js core concept has its own independent script:

| Script | Demonstrates | Run Command |
|--------|-------------|-------------|
| `01-repl-demo.mjs` | REPL interactive evaluation | `node experiments/exp7/01-repl-demo.mjs` |
| `02-http-server.mjs` | Raw HTTP server (`http.createServer`) | `node experiments/exp7/02-http-server.mjs` |
| `03-filesystem.mjs` | File System read/write/append | `node experiments/exp7/03-filesystem.mjs` |
| `04-buffers.mjs` | Buffer create/convert/inspect | `node experiments/exp7/04-buffers.mjs` |
| `05-streams.mjs` | Readable/Writable streams, chunked I/O | `node experiments/exp7/05-streams.mjs` |
| `06-event-loop.mjs` | Event loop phases, microtasks vs macrotasks | `node experiments/exp7/06-event-loop.mjs` |

## Combined Reference

The original combined script `node-demo.mjs` is retained as a single-file reference.

## How to Run

```bash
# Run each script individually
node experiments/exp7/01-repl-demo.mjs
node experiments/exp7/02-http-server.mjs
node experiments/exp7/03-filesystem.mjs
node experiments/exp7/04-buffers.mjs
node experiments/exp7/05-streams.mjs
node experiments/exp7/06-event-loop.mjs

# Or run the combined reference
node experiments/exp7/node-demo.mjs
```

## REPL Interactive Session

For REPL evidence, also demonstrate an interactive session:
```bash
$ node
> 2 + 3 * 4
14
> 'Kitab Ghar'.length
10
> const books = ['Norwegian Wood', 'Ikigai', 'The Alchemist']
> books.filter(b => b.length > 6)
[ 'Norwegian Wood', 'The Alchemist' ]
> .exit
```

## Notes

- All scripts use Kitab Ghar themed data (books, readers, Badlapur)
- No npm dependencies required (uses only Node.js built-in modules)
- Each script produces clear, labeled terminal output for evidence capture
- Temporary files created during filesystem/streams demos are cleaned up automatically
