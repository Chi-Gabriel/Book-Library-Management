document.addEventListener('DOMContentLoaded', () => {
    const genresTableBody = document.getElementById('genresTableBody');

    async function fetchGenres() {
        genresTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Loading genres...</td></tr>`;
        try {
            const response = await fetch(`${API_BASE_URL}/genres`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const genres = await response.json();
            renderGenresTable(genres);
        } catch (error) {
            console.error('Failed to fetch genres:', error);
            genresTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: red;">Error loading genres.</td></tr>`;
        }
    }

    function renderGenresTable(genres) {
        genresTableBody.innerHTML = '';

        if (genres.length === 0) {
            genresTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No genres found. <a href="add-genre.html">Add one?</a></td></tr>`;
            return;
        }

        genres.forEach(genre => {
            const row = genresTableBody.insertRow();
            row.insertCell().textContent = genre.name;
            row.insertCell().textContent = genre.description || 'N/A';
            row.insertCell().textContent = genre.bookCount !== undefined ? genre.bookCount : 'N/A';

            const actionsCell = row.insertCell();
            actionsCell.classList.add('action-links');
            actionsCell.innerHTML = `
                <a href="add-genre.html?id=${genre._id}">Edit</a>
                <a href="#" class="delete-btn" data-id="${genre._id}">Delete</a>
            `;
        });

        document.querySelectorAll('#genresTableBody .delete-btn').forEach(button => {
            button.addEventListener('click', handleDeleteGenre);
        });
    }

    async function handleDeleteGenre(event) {
        event.preventDefault();
        const genreId = event.target.dataset.id;
        const genreName = event.target.closest('tr').cells[0].textContent;

        if (confirm(`Are you sure you want to delete the genre "${genreName}"? This action cannot be undone.`)) {
            try {
                const response = await fetch(`${API_BASE_URL}/genres/${genreId}`, {
                    method: 'DELETE',
                });
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || `HTTP error! status: ${response.status}`);
                }
                alert(result.message || 'Genre deleted successfully!');
                fetchGenres();
            } catch (error) {
                console.error('Failed to delete genre:', error);
                alert(`Error deleting genre: ${error.message}`);
            }
        }
    }

    fetchGenres();
}); 