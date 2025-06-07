// js/dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    const totalBooksCountEl = document.getElementById('totalBooksCount');
    const availableBooksCountEl = document.getElementById('availableBooksCount');
    const authorsCountEl = document.getElementById('authorsCount');
    const genresCountEl = document.getElementById('genresCount');
    const quickBookSearchInput = document.getElementById('quickBookSearch');

    async function fetchDashboardStats() {
        try {
            const response = await fetch(`${API_BASE_URL}/stats`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const stats = await response.json();

            totalBooksCountEl.textContent = stats.totalBooks;
            availableBooksCountEl.textContent = stats.availableBooks;
            authorsCountEl.textContent = stats.totalAuthors;
            genresCountEl.textContent = stats.totalGenres;

        } catch (error) {
            console.error("Failed to fetch dashboard stats:", error);
            totalBooksCountEl.textContent = 'Error';
            availableBooksCountEl.textContent = 'Error';
            authorsCountEl.textContent = 'Error';
            genresCountEl.textContent = 'Error';
        }
    }

    quickBookSearchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission if it's in a form
            const searchTerm = quickBookSearchInput.value.trim();
            if (searchTerm) {
                // Navigate to all-books.html with search parameter
                window.location.href = `all-books.html?search=${encodeURIComponent(searchTerm)}`;
            }
        }
    });

    // Initial fetch
    fetchDashboardStats();
}); 