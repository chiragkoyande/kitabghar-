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

document.addEventListener('DOMContentLoaded', () => {

    // Helper to log to both screen and console
    const logOutput = (elementId, content) => {
        const el = document.getElementById(elementId);
        if (el) el.innerHTML = content;
        console.log(`[${elementId}]`, content.replace(/<br>/g, '\n').replace(/<\/?[^>]+(>|$)/g, ""));
    };

    // SECTION 1: Arrow Functions
    document.getElementById('btn-arrow-demo').addEventListener('click', () => {
        const formatPrice = (price) => '₹' + price.toFixed(2);
        const bookTitles = books.map(b => b.title);
        const getAvailable = () => books.filter(b => b.available);
        
        let out = `<b>Mapped Titles:</b><br>${bookTitles.join(', ')}<br><br>`;
        out += `<b>Filtered Available Count:</b> ${getAvailable().length}<br><br>`;
        out += `<b>Formatted Price Example:</b> ${formatPrice(books[0].price)}`;
        
        logOutput('out-arrow-demo', out);
    });

    // SECTION 2: Anonymous Functions
    document.getElementById('btn-anon-timeout').addEventListener('click', function() {
        const outEl = document.getElementById('out-anon-demo');
        outEl.innerHTML = "<i>Waiting 2 seconds...</i>";
        
        setTimeout(function() {
            logOutput('out-anon-demo', "<span class='text-danger fw-bold'>⏰ Rental reminder: Please return your books on time!</span>");
        }, 2000);
    });

    document.getElementById('btn-anon-foreach').addEventListener('click', function() {
        let outList = "<b>Kitab Ghar Collection:</b><ul>";
        books.forEach(function(book) {
            outList += `<li>${book.title} by ${book.author}</li>`;
        });
        outList += "</ul>";
        logOutput('out-anon-demo', outList);
    });

    // SECTION 3: Arrays
    document.getElementById('btn-array-map').addEventListener('click', () => {
        const mapped = books.map(b => `[${b.category}] ${b.title}`);
        logOutput('out-array-demo', "<b>map() result:</b><br>" + mapped.join('<br>'));
    });

    document.getElementById('btn-array-filter').addEventListener('click', () => {
        const filtered = books.filter(b => b.available && b.category === 'Fiction');
        const titles = filtered.map(b => b.title).join(', ') || 'None';
        logOutput('out-array-demo', "<b>filter() result (Available Fiction):</b><br>" + titles);
    });

    document.getElementById('btn-array-reduce').addEventListener('click', () => {
        const totalValue = books.reduce((acc, curr) => acc + curr.price, 0);
        const highestRated = books.reduce((prev, current) => (prev.rating > current.rating) ? prev : current);
        
        let out = `<b>reduce() results:</b><br>`;
        out += `Total Catalogue Value: ₹${totalValue}<br>`;
        out += `Highest Rated Book: ${highestRated.title} (${highestRated.rating}⭐)`;
        logOutput('out-array-demo', out);
    });

    // SECTION 4: Events
    const renderEventBooks = (filteredBooks) => {
        const container = document.getElementById('event-books-container');
        container.innerHTML = '';
        filteredBooks.forEach(b => {
            const el = document.createElement('div');
            el.className = 'border rounded p-2 bg-white small shadow-sm pointer';
            el.style.cursor = 'pointer';
            el.innerText = b.title;
            
            // Mouseover Event
            el.addEventListener('mouseover', function() {
                document.getElementById('hover-detail').innerText = `${b.title} - ${b.author} (₹${b.price})`;
            });
            el.addEventListener('mouseout', function() {
                document.getElementById('hover-detail').innerText = '';
            });
            container.appendChild(el);
        });
    };
    
    // Initial render
    renderEventBooks(books);

    // Click event
    document.getElementById('event-search-btn').addEventListener('click', () => {
        const query = document.getElementById('event-search-input').value.toLowerCase();
        const results = books.filter(b => b.title.toLowerCase().includes(query));
        renderEventBooks(results);
        console.log(`[Event: Click] Searched for '${query}'`);
    });

    // Input event (Live search)
    document.getElementById('event-search-input').addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const results = books.filter(b => b.title.toLowerCase().includes(query));
        renderEventBooks(results);
        console.log(`[Event: Input] Typing: '${query}'`);
    });

    // Change event
    document.getElementById('event-category-select').addEventListener('change', function() {
        const cat = this.value;
        const results = cat ? books.filter(b => b.category === cat) : books;
        renderEventBooks(results);
        console.log(`[Event: Change] Category selected: '${cat}'`);
    });

    // SECTION 5: Popup Boxes
    document.getElementById('btn-popup-alert').addEventListener('click', () => {
        alert("Success! Your book rental for 'Atomic Habits' has been confirmed.");
        logOutput('out-popup-demo', "alert() was shown and dismissed.");
    });

    document.getElementById('btn-popup-confirm').addEventListener('click', () => {
        const res = confirm("Remove 'Norwegian Wood' from your wishlist?");
        logOutput('out-popup-demo', `confirm() returned: <b>${res}</b>`);
    });

    document.getElementById('btn-popup-prompt').addEventListener('click', () => {
        const name = prompt("Welcome to Kitab Ghar! Please enter your name:");
        if(name !== null) {
            logOutput('out-popup-demo', `prompt() returned: <b>"${name}"</b><br>Hello, ${name}! Enjoy reading.`);
        } else {
            logOutput('out-popup-demo', `prompt() returned: <b>null</b> (User cancelled)`);
        }
    });

});
