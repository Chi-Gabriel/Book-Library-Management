document.addEventListener('DOMContentLoaded', () => {
    const addBookForm = document.getElementById('addBookForm');
    const authorSelect = document.getElementById('author');
    const genreSelect = document.getElementById('genre');
    const cancelBtn = document.getElementById('cancelBtn');
    const formMessageEl = document.getElementById('formMessage');

    // New elements for edit mode
    const pageMainTitleEl = document.getElementById('pageMainTitle');
    const bookIdInput = document.getElementById('bookId');
    const submitBookBtn = document.getElementById('submitBookBtn');

    // Form fields
    const titleInput = document.getElementById('title');
    const isbnInput = document.getElementById('isbn');
    const publicationYearInput = document.getElementById('publicationYear');
    const descriptionInput = document.getElementById('description');
    const availabilitySelect = document.getElementById('availability');

    const urlParams = new URLSearchParams(window.location.search);
    const currentBookId = urlParams.get('id');
    let isEditMode = false;

    if (currentBookId) {
        isEditMode = true;
        if (pageMainTitleEl) pageMainTitleEl.textContent = 'Edit Book';
        if (submitBookBtn) submitBookBtn.textContent = 'Update Book';
        if (bookIdInput) bookIdInput.value = currentBookId;
        // Populate dropdowns first, then fetch book details to correctly set selected options
        populateDropdowns().then(() => {
            if (isEditMode) fetchBookDetailsToEdit(currentBookId);
        });
    } else {
        populateDropdowns(); // Just populate for add mode
    }

    async function fetchBookDetailsToEdit(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/books/${id}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            const book = await response.json();

            titleInput.value = book.title;
            // Set selected for author and genre AFTER they are populated
            if (book.author) authorSelect.value = book.author._id || book.author;
            if (book.genre) genreSelect.value = book.genre._id || book.genre;
            isbnInput.value = book.ISBN;
            publicationYearInput.value = book.publicationYear;
            descriptionInput.value = book.description || '';
            availabilitySelect.value = book.availability ? 'true' : 'false';

        } catch (error) {
            console.error('Failed to fetch book details for editing:', error);
            displayFormMessage(`Error loading book details: ${error.message}.`, 'error');
            if (submitBookBtn) submitBookBtn.disabled = true;
        }
    }

    async function populateDropdowns() {
        try {
            const authorsRes = await fetch(`${API_BASE_URL}/authors`);
            const authorsData = await authorsRes.json();
            authorsData.forEach(author => {
                const option = document.createElement('option');
                option.value = author._id;
                option.textContent = author.name;
                authorSelect.appendChild(option);
            });

            const genresRes = await fetch(`${API_BASE_URL}/genres`);
            const genresData = await genresRes.json();
            genresData.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre._id;
                option.textContent = genre.name;
                genreSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Failed to populate dropdowns:', error);
            displayFormMessage('Error loading authors/genres. Please try refreshing.', 'error');
        }
    }

    function displayFormMessage(message, type) {
        formMessageEl.textContent = message;
        formMessageEl.className = `form-message ${type}`;
        formMessageEl.style.display = 'block';
    }

    addBookForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        formMessageEl.style.display = 'none';

        const bookData = {
            title: titleInput.value.trim(),
            author: authorSelect.value,
            ISBN: isbnInput.value.trim(),
            genre: genreSelect.value,
            publicationYear: parseInt(publicationYearInput.value),
            description: descriptionInput.value.trim(),
            availability: availabilitySelect.value === 'true'
        };

        if (!bookData.title || !bookData.author || !bookData.ISBN || !bookData.genre || !bookData.publicationYear) {
            displayFormMessage('Please fill in all required fields (Title, Author, ISBN, Genre, Publication Year).', 'error');
            return;
        }

        let url = `${API_BASE_URL}/books`;
        let method = 'POST';

        if (isEditMode && currentBookId) {
            url = `${API_BASE_URL}/books/${currentBookId}`;
            method = 'PUT';
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookData),
            });

            const result = await response.json();

            if (!response.ok) {
                const errorMessage = result.error || `HTTP error! status: ${response.status}`;
                throw new Error(errorMessage);
            }

            const successMessage = isEditMode ? 'Book updated successfully!' : 'Book added successfully!';
            displayFormMessage(`${successMessage} Redirecting...`, 'success');

            if (!isEditMode) addBookForm.reset();

            setTimeout(() => {
                // If editing, redirect to view page, else to all books
                window.location.href = isEditMode ? `view-book.html?id=${currentBookId}` : 'all-books.html';
            }, 1500);

        } catch (error) {
            console.error(`Failed to ${isEditMode ? 'update' : 'add'} book:`, error);
            displayFormMessage(`Error: ${error.message}`, 'error');
        }
    });

    cancelBtn.addEventListener('click', () => {
        // If editing, go back to view page, else to all books
        if (isEditMode && currentBookId) {
            window.location.href = `view-book.html?id=${currentBookId}`;
        } else {
            window.location.href = 'all-books.html';
        }
    });
}); 