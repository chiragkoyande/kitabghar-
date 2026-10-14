const loopOrder = ["synchronous"];
process.nextTick(() => loopOrder.push("nextTick"));
Promise.resolve().then(() => loopOrder.push("promise"));
setImmediate(() => loopOrder.push("setImmediate"));
setTimeout(() => loopOrder.push("setTimeout"), 0);
await new Promise((resolve) => setTimeout(resolve, 25));