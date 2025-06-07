document.addEventListener('DOMContentLoaded', () => {
    const authorsTableBody = document.getElementById('authorsTableBody');

    async function fetchAuthors() {
        authorsTableBody.innerHTML = `<tr><td colspan="3" style="text-align:center;">Loading authors...</td></tr>`;
        try {
            const response = await fetch(`${API_BASE_URL}/authors`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const authors = await response.json();
            renderAuthorsTable(authors);
        } catch (error) {
            console.error('Failed to fetch authors:', error);
            authorsTableBody.innerHTML = `<tr><td colspan="3" style="text-align:center; color: red;">Error loading authors.</td></tr>`;
        }
    }

    function renderAuthorsTable(authors) {
        authorsTableBody.innerHTML = '';

        if (authors.length === 0) {
            authorsTableBody.innerHTML = `<tr><td colspan="3" style="text-align:center;">No authors found. <a href="add-author.html">Add one?</a></td></tr>`;
            return;
        }

        authors.forEach(author => {
            const row = authorsTableBody.insertRow();
            row.insertCell().textContent = author.name;
            row.insertCell().textContent = author.numberOfBooks !== undefined ? author.numberOfBooks : 'N/A';

            const actionsCell = row.insertCell();
            actionsCell.classList.add('action-links');
            actionsCell.innerHTML = `
                <a href="add-author.html?id=${author._id}">Edit</a>
                <a href="#" class="delete-btn" data-id="${author._id}">Delete</a>
            `;
        });

        document.querySelectorAll('#authorsTableBody .delete-btn').forEach(button => {
            button.addEventListener('click', handleDeleteAuthor);
        });
    }

    async function handleDeleteAuthor(event) {
        event.preventDefault();
        const authorId = event.target.dataset.id;
        const authorName = event.target.closest('tr').cells[0].textContent;

        if (confirm(`Are you sure you want to delete "${authorName}"? This action cannot be undone.`)) {
            try {
                const response = await fetch(`${API_BASE_URL}/authors/${authorId}`, {
                    method: 'DELETE',
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || `HTTP error! status: ${response.status}`);
                }

                alert(result.message || 'Author deleted successfully!');
                fetchAuthors();
            } catch (error) {
                console.error('Failed to delete author:', error);
                alert(`Error deleting author: ${error.message}`);
            }
        }
    }

    fetchAuthors();
}); 