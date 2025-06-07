document.addEventListener('DOMContentLoaded', () => {
    const booksTableBody = document.getElementById('booksTableBody');
    const bookSearchInput = document.getElementById('bookSearchInput');
    const authorFilter = document.getElementById('authorFilter');
    const genreFilter = document.getElementById('genreFilter');
    const availabilityFilter = document.getElementById('availabilityFilter');
    const sortBy = document.getElementById('sortBy');
    const sortOrder = document.getElementById('sortOrder');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');

    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const pageInfo = document.getElementById('pageInfo');

    let currentPage = 1;
    const limit = 10;

    async function fetchBooks() {
        let queryParams = `?page=${currentPage}&limit=${limit}`;
        const searchTerm = bookSearchInput.value.trim();
        const selectedAuthor = authorFilter.value;
        const selectedGenre = genreFilter.value;
        const selectedAvailability = availabilityFilter.value;
        const selectedSortBy = sortBy.value;
        const selectedSortOrder = sortOrder.value;

        if (searchTerm) queryParams += `&search=${encodeURIComponent(searchTerm)}`;
        if (selectedAuthor) queryParams += `&authorId=${selectedAuthor}`;
        if (selectedGenre) queryParams += `&genreId=${selectedGenre}`;
        if (selectedAvailability !== "") queryParams += `&availability=${selectedAvailability}`;
        if (selectedSortBy) queryParams += `&sortBy=${selectedSortBy}&sortOrder=${selectedSortOrder}`;

        booksTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">Loading books...</td></tr>`;

        try {
            const response = await fetch(`${API_BASE_URL}/books${queryParams}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            renderBooksTable(data.books);
            renderPaginationControls(data);
        } catch (error) {
            console.error('Failed to fetch books:', error);
            booksTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: red;">Error loading books.</td></tr>`;
        }
    }

    function renderBooksTable(books) {
        booksTableBody.innerHTML = '';

        if (books.length === 0) {
            booksTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No books found matching your criteria.</td></tr>`;
            return;
        }

        books.forEach(book => {
            const row = booksTableBody.insertRow();
            row.style.cursor = 'pointer';
            row.addEventListener('click', (event) => {
                // Don't navigate if clicking on action buttons
                if (!event.target.closest('.action-links')) {
                    window.location.href = `view-book.html?id=${book._id}`;
                }
            });
            
            row.insertCell().textContent = book.title || 'N/A';
            row.insertCell().textContent = book.author ? book.author.name : 'N/A';
            row.insertCell().textContent = book.ISBN || 'N/A';
            row.insertCell().textContent = book.genre ? book.genre.name : 'N/A';
            row.insertCell().textContent = book.publicationYear || 'N/A';

            const availabilityCell = row.insertCell();
            const availabilitySpan = document.createElement('span');
            availabilitySpan.classList.add('availability-tag');
            if (book.availability) {
                availabilitySpan.classList.add('available');
                availabilitySpan.textContent = 'Available';
            } else {
                availabilitySpan.classList.add('unavailable');
                availabilitySpan.textContent = 'Unavailable';
            }
            availabilityCell.appendChild(availabilitySpan);

            const actionsCell = row.insertCell();
            actionsCell.classList.add('action-links');
            actionsCell.innerHTML = `
                <a href="view-book.html?id=${book._id}">View</a>
                <a href="add-book.html?id=${book._id}">Edit</a>
                <a href="#" class="delete-btn" data-id="${book._id}">Delete</a>
            `;
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', handleDeleteBook);
        });
    }

    function renderPaginationControls(data) {
        pageInfo.textContent = `Page ${data.currentPage} of ${data.totalPages}`;
        prevPageBtn.disabled = !data.hasPrevPage;
        nextPageBtn.disabled = !data.hasNextPage;

        currentPage = data.currentPage;
    }

    async function populateFilters() {
        try {
            const authorsRes = await fetch(`${API_BASE_URL}/authors`);
            const authorsData = await authorsRes.json();
            authorsData.forEach(author => {
                const option = document.createElement('option');
                option.value = author._id;
                option.textContent = author.name;
                authorFilter.appendChild(option);
            });

            const genresRes = await fetch(`${API_BASE_URL}/genres`);
            const genresData = await genresRes.json();
            genresData.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre._id;
                option.textContent = genre.name;
                genreFilter.appendChild(option);
            });
        } catch (error) {
            console.error('Failed to populate filters:', error);
        }
    }

    async function handleDeleteBook(event) {
        event.preventDefault();
        const bookId = event.target.dataset.id;
        if (confirm('Are you sure you want to delete this book?')) {
            try {
                const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
                }
                alert('Book deleted successfully!');
                fetchBooks();
            } catch (error) {
                console.error('Failed to delete book:', error);
                alert(`Error deleting book: ${error.message}`);
            }
        }
    }

    applyFiltersBtn.addEventListener('click', () => {
        currentPage = 1;
        fetchBooks();
    });

    bookSearchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            currentPage = 1;
            fetchBooks();
        }
    });

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchBooks();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        currentPage++;
        fetchBooks();
    });

    function applyUrlSearchParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchFromUrl = urlParams.get('search');
        if (searchFromUrl) {
            bookSearchInput.value = searchFromUrl;
        }
    }

    applyUrlSearchParams();
    populateFilters().then(() => {
        fetchBooks();
    });
}); 