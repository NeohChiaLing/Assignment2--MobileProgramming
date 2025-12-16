// --- 1. SETUP & INITIALIZATION ---
window.onload = function() {
    fetchMovie(); // Load movie content immediately upon start
};

// Function to handle tab switching and section visibility
function showSection(id, element) {
    // Hide all sections first
    document.querySelectorAll('.api-section').forEach(el => el.classList.remove('active-section'));
    // Show the selected section
    document.getElementById(id).classList.add('active-section');

    // Update navigation active state (if clicked from nav)
    if(element) {
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        element.classList.add('active');
    }

    // If 'logs' section is opened, render the logs and close the menu drawer
    if(id === 'logs') {
        renderLogs();
        const offcanvasEl = document.getElementById('offcanvasMenu');
        const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
        if(offcanvas) offcanvas.hide();
    }
}

// Function to save user actions to Local Storage
function logInteraction(api, action) {
    const logs = JSON.parse(localStorage.getItem('appLogs')) || [];
    logs.unshift({ api, action }); // Add new log to the top
    localStorage.setItem('appLogs', JSON.stringify(logs));
}

// --- 2. MOVIE API (Ghibli) ---
async function fetchMovie() {
    try {
        const res = await fetch('https://ghibliapi.vercel.app/films');
        const data = await res.json();
        const movie = data[Math.floor(Math.random() * data.length)];

        // Render HTML for movie card
        const html = `
            <div class="card mb-3 cyber-card" style="border:0; background: url('${movie.movie_banner}') center/cover; height: 350px; position: relative; overflow: hidden;">
                <div style="position: absolute; bottom:0; left:0; width:100%; background: linear-gradient(to top, #050505, transparent); padding: 25px;">
                    <h2 class="text-white mb-1" style="font-family: 'Orbitron'">${movie.title}</h2>
                    <div class="d-flex gap-2">
                        <span class="badge" style="background:var(--neon-purple); box-shadow:0 0 10px var(--neon-purple)">${movie.running_time} min</span>
                        <span class="badge" style="background:var(--neon-cyan); color:black; box-shadow:0 0 10px var(--neon-cyan)">Score: ${movie.rt_score}</span>
                    </div>
                </div>
            </div>
            <div class="p-2 border-start border-3 border-info ps-3">
                <p class="text-secondary" style="font-size: 15px; line-height: 1.6;">${movie.description}</p>
            </div>
        `;
        document.getElementById('movieResult').innerHTML = html;
        logInteraction('Movie API', `Viewed ${movie.title}`);
    } catch (e) { console.log(e); }
}

// --- 3. FOOD API (TheMealDB) ---
async function fetchMeal() {
    try {
        const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const data = await res.json();
        const meal = data.meals[0];

        const html = `
            <div class="card cyber-card">
                <img src="${meal.strMealThumb}" class="card-img-top" alt="Meal" style="height: 200px; object-fit: cover; opacity: 0.9;">
                <div class="card-body">
                    <h5 class="card-title text-cyan">${meal.strMeal}</h5>
                    <p class="small text-secondary mb-3">${meal.strCategory} | ${meal.strArea}</p>
                    <a href="${meal.strYoutube}" class="btn cyber-btn btn-sm">WATCH DATA STREAM (Video)</a>
                </div>
            </div>
        `;
        document.getElementById('mealResult').innerHTML = html;
        logInteraction('Food API', `Viewed ${meal.strMeal}`);
    } catch (e) { alert("Failed to load meal"); }
}

// --- 4. PRODUCT API (FakeStore) ---
async function fetchProducts() {
    try {
        const res = await fetch('https://fakestoreapi.com/products?limit=10');
        const all = await res.json();
        // Randomly select 3 items
        const cart = all.sort(() => 0.5 - Math.random()).slice(0, 3);

        let total = 0;
        let listHtml = '';

        cart.forEach(item => {
            const priceRM = item.price * 4.5;
            total += priceRM;
            listHtml += `
                <div class="d-flex align-items-center mb-3 pb-3" style="border-bottom:1px solid rgba(255,255,255,0.05)">
                    <img src="${item.image}" style="width:50px; height:50px; object-fit:contain; background:white; border-radius:8px; padding:2px;" class="me-3">
                    <div class="flex-grow-1">
                        <h6 class="mb-0 text-truncate text-white" style="max-width: 180px; font-size:14px;">${item.title}</h6>
                        <small class="text-cyan">RM ${priceRM.toFixed(2)}</small>
                    </div>
                </div>
            `;
        });

        // Shipping logic
        let msg = total > 150 ? '✅ FREE SHIPPING PROTOCOL' : '⚠️ SHIPPING: +RM15.00';
        let totalDisplay = total > 150 ? total : total + 15;

        const summaryHtml = `
            <div class="card p-3 cyber-card">
                ${listHtml}
                <div class="mt-2 pt-2">
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="text-secondary small">TOTAL CREDIT</span>
                        <h3 class="mb-0 text-glow">RM ${totalDisplay.toFixed(2)}</h3>
                    </div>
                    <div class="mt-2 small" style="color: ${total > 150 ? '#00f3ff' : '#ff0055'};">${msg}</div>
                </div>
            </div>
        `;

        document.getElementById('productResult').innerHTML = summaryHtml;
        logInteraction('Product API', `Cart Total: RM ${totalDisplay.toFixed(2)}`);

    } catch (e) { console.log(e); }
}

// --- 5. LOGS SYSTEM ---
function renderLogs() {
    const logs = JSON.parse(localStorage.getItem('appLogs')) || [];
    const tbody = document.getElementById('logTableBody');
    tbody.innerHTML = '';

    // Display top 15 logs
    logs.slice(0, 15).forEach(log => {
        tbody.innerHTML += `
            <tr>
                <td class="p-3"><span class="badge" style="background:transparent; border:1px solid var(--text-secondary); color:var(--text-secondary)">${log.api}</span></td>
                <td class="p-3 small text-white">${log.action}</td>
            </tr>
        `;
    });
}

function clearLogs() {
    localStorage.removeItem('appLogs');
    renderLogs();
}