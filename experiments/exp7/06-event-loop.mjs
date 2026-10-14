import fs from 'node:fs';

console.log('==================================================');
console.log('Kitab Ghar - Event Loop Phases Demonstration');
console.log('==================================================');

console.log('\nExpected Execution Order:');
console.log('1. Synchronous Code');
console.log('2. process.nextTick (Microtask)');
console.log('3. Promise.resolve().then() (Microtask)');
console.log('4. setTimeout(..., 0) (Timers Phase)');
console.log('5. setImmediate (Check Phase)');
console.log('6. I/O Callbacks\n');

console.log('--- ACTUAL EXECUTION OUTPUT ---\n');

let stepCounter = 1;
const logStep = (phase, message) => {
  console.log(`[Step ${stepCounter++}] ${phase.padEnd(15)}: ${message}`);
};

// 1. Synchronous execution (Runs immediately)
logStep('Sync', 'Processing reader registration...');

// 2. setTimeout (Timers phase)
setTimeout(() => {
  logStep('setTimeout', 'Sending rental reminder... (Macrotask/Timer)');
}, 0);

// 3. setImmediate (Check phase)
setImmediate(() => {
  logStep('setImmediate', 'Updating dashboard... (Check Phase)');
});

// 4. process.nextTick (Microtask, runs right after current operation before Event Loop continues)
process.nextTick(() => {
  logStep('nextTick', 'Validating membership... (Microtask)');
});

// 5. Promise (Microtask, runs after nextTick queue)
Promise.resolve().then(() => {
  logStep('Promise', 'Fetching book catalogue... (Microtask)');
});

// 6. I/O Operation (Poll phase)
// Using fs.stat instead of fs.readFile so it's faster but still I/O
fs.stat(process.cwd(), (err, stats) => {
  if (err) throw err;
  logStep('I/O Callback', 'Verifying library directory... (Poll Phase)');
  
  // Demonstrating Nested Event Loop behavior inside an I/O callback
  console.log('\n--- Round 2: Nested inside I/O Callback ---');
  
  setTimeout(() => {
    logStep('setTimeout 2', 'Late fee calculation... (Timer)');
  }, 0);

  setImmediate(() => {
    // Inside I/O, setImmediate ALWAYS runs before setTimeout(0)
    // because the check phase runs immediately after the poll phase
    logStep('setImmediate 2', 'Syncing inventory... (Check Phase - Runs before setTimeout here!)');
  });

  process.nextTick(() => {
    logStep('nextTick 2', 'Updating cache... (Microtask)');
  });
});

// 7. Another Synchronous execution at the end of main script
logStep('Sync', 'Initial script execution completed.');

/*
 * Explanation of Order:
 * 1. Synchronous code always runs first.
 * 2. `process.nextTick` queue is processed completely before continuing.
 * 3. `Promise` queue is processed next.
 * 4. Event loop starts. `setTimeout(fn, 0)` is placed in the Timers phase queue.
 * 5. `setImmediate` is placed in the Check phase queue.
 * 6. Node enters Timers phase -> runs `setTimeout`.
 * 7. Node enters Poll phase -> finds no I/O immediately ready, checks for `setImmediate`.
 * 8. Node enters Check phase -> runs `setImmediate`.
 * 9. Sometime later, the I/O operation (fs.stat) completes, firing its callback in Poll phase.
 * 
 * Inside the I/O callback:
 * 1. `process.nextTick` runs immediately after the callback.
 * 2. Node is currently in Poll phase. It proceeds to the Check phase.
 * 3. Therefore, `setImmediate` runs BEFORE `setTimeout` when scheduled inside an I/O callback!
 */
