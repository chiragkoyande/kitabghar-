import { EventEmitter } from 'events';

// Kitab Ghar Book Catalogue
const books = [
    { title: 'Norwegian Wood', author: 'Haruki Murakami', category: 'Fiction', price: 90, available: true, rating: 4.5 },
    { title: 'Ikigai', author: 'Héctor García', category: 'Self-Help', price: 60, available: true, rating: 4.8 },
    { title: 'The Alchemist', author: 'Paulo Coelho', category: 'Fiction', price: 75, available: false, rating: 4.7 },
    { title: 'Atomic Habits', author: 'James Clear', category: 'Self-Help', price: 100, available: true, rating: 4.9 },
    { title: 'The Murder on the Orient Express', author: 'Agatha Christie', category: 'Mystery', price: 50, available: false, rating: 4.6 },
    { title: 'Sapiens', author: 'Yuval Noah Harari', category: 'Non-Fiction', price: 120, available: true, rating: 4.8 },
    { title: 'The Subtle Art of Not Giving a F*ck', author: 'Mark Manson', category: 'Self-Help', price: 80, available: true, rating: 4.4 },
    { title: 'Wings of Fire', author: 'A.P.J. Abdul Kalam', category: 'Biography', price: 70, available: true, rating: 4.9 }
];

console.log("=========================================");
console.log("📚 KITAB GHAR - ES6 TERMINAL DEMONSTRATION");
console.log("=========================================\n");

// SECTION 1: Arrow Functions
console.log("--- SECTION 1: Arrow Functions ---");
const formatPrice = (price) => `₹${price.toFixed(2)}`;
const bookTitles = books.map(b => b.title);
console.log("Mapped Titles:", bookTitles.join(', '));
console.log("Formatted Price:", formatPrice(books[0].price));
console.log("\n");


// SECTION 2: Anonymous Functions
console.log("--- SECTION 2: Anonymous Functions ---");
console.log("Listing some books using anonymous function in forEach:");
books.slice(0, 3).forEach(function(book) {
    console.log(` - ${book.title} (${book.category})`);
});
console.log("\n");


// SECTION 3: Arrays (map, filter, reduce)
console.log("--- SECTION 3: Arrays ---");
const availableFiction = books.filter(b => b.available && b.category === 'Fiction');
console.log("filter() - Available Fiction:", availableFiction.map(b => b.title));

const totalValue = books.reduce((acc, curr) => acc + curr.price, 0);
console.log("reduce() - Total Catalogue Value:", formatPrice(totalValue));
console.log("\n");


// SECTION 4: Events (using Node.js EventEmitter)
console.log("--- SECTION 4: Events (Node EventEmitter) ---");
const libraryEvents = new EventEmitter();

// Event listener (anonymous function as callback)
libraryEvents.on('rent', function(bookTitle, user) {
    console.log(`[Event Triggered] -> '${bookTitle}' was rented by ${user}`);
});

// Triggering the event
libraryEvents.emit('rent', 'Ikigai', 'Rahul');
libraryEvents.emit('rent', 'Atomic Habits', 'Sneha');
console.log("\n");


// SECTION 5: Callbacks / Timing
console.log("--- SECTION 5: Timing (Anonymous Callbacks) ---");
console.log("Waiting 2 seconds for a reminder...");
setTimeout(function() {
    console.log("⏰ Reminder: Your rental period for 'Sapiens' expires tomorrow.");
    console.log("=========================================\n");
}, 2000);
