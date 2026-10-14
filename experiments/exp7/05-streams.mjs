import { createReadStream, createWriteStream } from 'node:fs';
import { unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

console.log('==================================================');
console.log('Kitab Ghar - Streams Demonstration');
console.log('==================================================');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cataloguePath = path.resolve(__dirname, '../../server/data/catalogue.js');
const summaryPath = path.join(__dirname, 'kitab-ghar-summary-output.txt');

// 1. Reading from a Stream in Chunks
console.log('\n--- 1. Reading File via Stream ---');
console.log(`Source: ${cataloguePath}`);

const readStream = createReadStream(cataloguePath, { encoding: 'utf8', highWaterMark: 1024 }); // Read in 1KB chunks for demo

let chunkCount = 0;
let totalBytes = 0;

readStream.on('data', (chunk) => {
  chunkCount++;
  const bytes = Buffer.byteLength(chunk);
  totalBytes += bytes;
  console.log(`Received Chunk #${chunkCount}: ${bytes} bytes`);
});

readStream.on('end', () => {
  console.log('\n--- Stream Reading Completed ---');
  console.log(`Total Chunks: ${chunkCount}`);
  console.log(`Total Bytes: ${totalBytes}`);
  
  // 2. Piping streams
  demonstratePiping();
});

readStream.on('error', (err) => {
  console.error('Error reading file stream:', err);
});

// Function to demonstrate piping
function demonstratePiping() {
  console.log('\n--- 2. Piping Streams (Read -> Write) ---');
  console.log(`Piping catalogue content to: ${path.basename(summaryPath)}`);
  
  // Create fresh streams for piping
  const pipeReadStream = createReadStream(cataloguePath);
  const pipeWriteStream = createWriteStream(summaryPath);
  
  // Handle events on the write stream
  pipeWriteStream.on('finish', async () => {
    console.log('✅ Piping completed successfully.');
    
    // Clean up temporary file
    console.log('\nCleaning up temporary files...');
    try {
      await unlink(summaryPath);
      console.log(`Deleted: ${path.basename(summaryPath)}`);
      console.log('\n✅ Stream operations completed.');
    } catch (cleanupErr) {
      console.error('Error during cleanup:', cleanupErr);
    }
  });

  pipeWriteStream.on('error', (err) => {
    console.error('Error writing stream:', err);
  });

  // Execute pipe
  pipeReadStream.pipe(pipeWriteStream);
}
