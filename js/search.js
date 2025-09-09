// Search functionality
let searchSuggestions = [
    { text: "Stock price changes", category: "Finance", icon: "chart-line" },
    { text: "News updates", category: "News", icon: "newspaper" },
    { text: "Weather alerts", category: "Weather", icon: "cloud-rain" },
    { text: "Price drops", category: "Shopping", icon: "shopping-cart" },
    { text: "Sports scores", category: "Sports", icon: "baseball-ball" },
    { text: "Crypto prices", category: "Cryptocurrency", icon: "bitcoin-sign" },
    { text: "Job postings", category: "Career", icon: "briefcase" },
    { text: "Product launches", category: "Technology", icon: "rocket" }
];

function handleSearchSubmit() {
    const searchInput = document.getElementById('header-notify-search');
    const searchValue = searchInput.value.trim();
    
    if (searchValue) {
        // For now, open alert modal with the search term
        openAlertModal(searchValue);
        searchInput.value = '';
        hideHeaderSuggestions();
    }
}

function handleEnterKey(event) {
    if (event.key === 'Enter') {
        handleSearchSubmit();
    }
}

function handleTypingSuggestions(value) {
    const suggestionsContainer = document.getElementById('dynamic-suggestions');
    
    if (!value.trim()) {
        suggestionsContainer.innerHTML = '';
        return;
    }
    
    const filtered = searchSuggestions.filter(item => 
        item.text.toLowerCase().includes(value.toLowerCase()) ||
        item.category.toLowerCase().includes(value.toLowerCase())
    );
    
    suggestionsContainer.innerHTML = filtered.slice(0, 5).map(item => `
        <button onclick="selectSuggestion('${item.text}')" 
                class="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 flex items-center gap-3">
            <i class="fas fa-${item.icon} text-blue-500 text-sm w-4"></i>
            <div>
                <div class="text-sm font-medium text-gray-900 dark:text-gray-100">${item.text}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">${item.category}</div>
            </div>
        </button>
    `).join('');
}

function selectSuggestion(suggestion) {
    const searchInput = document.getElementById('header-notify-search');
    searchInput.value = suggestion;
    hideHeaderSuggestions();
    openAlertModal(suggestion);
}

function showHeaderSuggestions() {
    const suggestions = document.getElementById('header-suggestions');
    suggestions.classList.remove('hidden');
}

function hideHeaderSuggestions() {
    setTimeout(() => {
        const suggestions = document.getElementById('header-suggestions');
        suggestions.classList.add('hidden');
    }, 200);
}

function stopTypewriterEffect() {
    // Placeholder for typewriter effect stop
    console.log('Stopping typewriter effect');
}

// Expose functions globally
window.handleSearchSubmit = handleSearchSubmit;
window.handleEnterKey = handleEnterKey;
window.handleTypingSuggestions = handleTypingSuggestions;
window.selectSuggestion = selectSuggestion;
window.showHeaderSuggestions = showHeaderSuggestions;
window.hideHeaderSuggestions = hideHeaderSuggestions;
window.stopTypewriterEffect = stopTypewriterEffect;