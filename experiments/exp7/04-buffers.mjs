console.log('==================================================');
console.log('Kitab Ghar - Buffers Demonstration');
console.log('==================================================');

// 1. Creating Buffers from strings
console.log('\n--- 1. Creating Buffers ---');
const text = 'Kitab Ghar · Badlapur';
const bufferFromString = Buffer.from(text, 'utf8');

console.log('Original String:', text);
console.log('Buffer object:', bufferFromString);

// 2. Displaying Buffer content in different encodings
console.log('\n--- 2. Buffer Encodings ---');
console.log('toString(utf8):', bufferFromString.toString('utf8'));
console.log('toString(hex):', bufferFromString.toString('hex'));
console.log('toString(base64):', bufferFromString.toString('base64'));

// 3. String length vs Buffer length (Demonstrating multi-byte characters)
// The '·' character takes more than 1 byte in UTF-8
console.log('\n--- 3. String vs Buffer Length ---');
console.log(`String length: ${text.length} characters`);
console.log(`Buffer length: ${bufferFromString.length} bytes`);

// 4. Allocating and Writing to empty buffer
console.log('\n--- 4. Allocating & Writing ---');
const allocBuffer = Buffer.alloc(16); // 16 bytes, filled with zeros
console.log('Empty Allocated Buffer:', allocBuffer);
allocBuffer.write('Ikigai');
console.log('After writing "Ikigai":', allocBuffer);
console.log('Decoded text:', allocBuffer.toString('utf8').replace(/\0/g, ''));

// 5. Concatenating Buffers
console.log('\n--- 5. Concatenating Buffers ---');
const buf1 = Buffer.from('Norwegian ');
const buf2 = Buffer.from('Wood');
const concatenated = Buffer.concat([buf1, buf2]);
console.log('buf1:', buf1.toString());
console.log('buf2:', buf2.toString());
console.log('Concatenated:', concatenated.toString());

// 6. Slicing/Subarray
console.log('\n--- 6. Extracting Portions ---');
// Extracting 'Ghar' from 'Kitab Ghar · Badlapur'
const sliced = bufferFromString.subarray(6, 10);
console.log('Sliced buffer (bytes 6-10):', sliced.toString('utf8'));

// 7. Copying Buffers
console.log('\n--- 7. Copying Buffers ---');
const sourceBuf = Buffer.from('Library');
const targetBuf = Buffer.alloc(10);
sourceBuf.copy(targetBuf);
console.log('Target Buffer after copy:', targetBuf.toString('utf8').replace(/\0/g, ''));

console.log('\n✅ Buffer operations completed.');
