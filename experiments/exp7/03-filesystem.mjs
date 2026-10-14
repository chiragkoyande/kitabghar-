import { writeFileSync, readFileSync, appendFileSync, statSync } from 'node:fs';
import { writeFile, readFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

console.log('==================================================');
console.log('Kitab Ghar - File System Demonstration');
console.log('==================================================');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePathSync = path.join(__dirname, 'kitab-ghar-reader-note.txt');
const filePathAsync = path.join(__dirname, 'kitab-ghar-books-async.txt');

// 1. Synchronous File Operations
console.log('\n--- Synchronous File Operations ---');
try {
  // Create file
  console.log('Writing note...');
  writeFileSync(filePathSync, 'Reader: Badlapur Reader\nMembership: Premium\n', 'utf8');
  
  // Read file
  console.log('Reading note:');
  let content = readFileSync(filePathSync, 'utf8');
  console.log(content.trim());
  
  // Append to file
  console.log('\nAppending rental reminder...');
  appendFileSync(filePathSync, 'Reminder: Return "Norwegian Wood" by tomorrow.\n', 'utf8');
  
  // Read again
  console.log('Reading updated note:');
  content = readFileSync(filePathSync, 'utf8');
  console.log(content.trim());
  
  // File Stats
  const stats = statSync(filePathSync);
  console.log(`\nFile Size: ${stats.size} bytes`);
  console.log(`Created At: ${stats.birthtime}`);
} catch (error) {
  console.error('Error in synchronous operations:', error);
}

// 2. Asynchronous File Operations (Promises)
console.log('\n--- Asynchronous File Operations ---');
async function runAsyncOperations() {
  try {
    const booksList = '1. The Alchemist\n2. Ikigai\n3. Norwegian Wood\n';
    
    console.log('Writing books list asynchronously...');
    await writeFile(filePathAsync, booksList, 'utf8');
    
    console.log('Reading books list asynchronously:');
    const asyncContent = await readFile(filePathAsync, 'utf8');
    console.log(asyncContent.trim());
    
    // Clean up temporary files
    console.log('\nCleaning up temporary files...');
    await unlink(filePathAsync);
    console.log(`Deleted: ${path.basename(filePathAsync)}`);
    
    // Cleanup synchronous file too (using async unlink for demonstration)
    await unlink(filePathSync);
    console.log(`Deleted: ${path.basename(filePathSync)}`);
    
    console.log('\n✅ File system operations completed successfully.');
  } catch (error) {
    console.error('Error in asynchronous operations:', error);
  }
}

runAsyncOperations();
