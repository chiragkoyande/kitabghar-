import repl from 'node:repl';

console.log('==================================================');
console.log('Kitab Ghar - REPL Demonstration');
console.log('==================================================');
console.log('\nStarting a programmatic REPL session...');
console.log('You can type JavaScript expressions here.');
console.log('Example: 2 + 3 * 4');
console.log('Example: "Kitab Ghar".toUpperCase()');
console.log('Type .help for commands, .exit to quit.\n');

// Start the REPL
const replServer = repl.start({
  prompt: 'kitab-ghar> ',
  useColors: true
});

// Inject Kitab Ghar specific data into the REPL context
replServer.context.books = [
  { title: 'Norwegian Wood', category: 'Fiction', status: 'available' },
  { title: 'Ikigai', category: 'Self-Help', status: 'rented' },
  { title: 'The Alchemist', category: 'Fiction', status: 'available' }
];

replServer.context.reader = {
  name: 'Badlapur Reader',
  activeRentals: 1,
  membership: 'Premium'
};

console.log('Context injected: Try typing `books` or `reader` to see the data!\n');

/*
 * Manual REPL instructions (for students):
 * 1. Open your terminal.
 * 2. Type `node` and press Enter.
 * 3. You are now in the Node.js REPL.
 * 4. Try evaluating arithmetic: 5 * 10
 * 5. Try string operations: "Library".split('')
 * 6. Press Ctrl+C twice or type `.exit` to exit.
 */
