document.addEventListener('DOMContentLoaded', () => {
    const bookDetailsLoadingEl = document.getElementById('bookDetailsLoading');
    const bookDetailsErrorEl = document.getElementById('bookDetailsError');
    const bookDetailsContentEl = document.getElementById('bookDetailsContent');

    const breadcrumbBookTitleEl = document.getElementById('breadcrumbBookTitle');
    const bookTitleEl = document.getElementById('bookTitle');
    const bookAuthorEl = document.getElementById('bookAuthor');
    const bookISBNEl = document.getElementById('bookISBN');
    const bookGenreEl = document.getElementById('bookGenre');
    const bookPublicationYearEl = document.getElementById('bookPublicationYear');
    const bookAvailabilityEl = document.getElementById('bookAvailability');
    const bookDescriptionEl = document.getElementById('bookDescription');
    const editBookBtn = document.getElementById('editBookBtn');
    const deleteBookBtn = document.getElementById('deleteBookBtn');

    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    if (!bookId) {
        showError('No book ID provided. Please go back to the books list.');
        return;
    }

    async function fetchBookDetails() {
        try {
            const response = await fetch(`${API_BASE_URL}/books/${bookId}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            const book = await response.json();
            displayBookDetails(book);
        } catch (error) {
            console.error('Failed to fetch book details:', error);
            showError(`Error loading book details: ${error.message}`);
        }
    }

    function displayBookDetails(book) {
        bookDetailsLoadingEl.style.display = 'none';
        bookDetailsContentEl.style.display = 'block';

        breadcrumbBookTitleEl.textContent = book.title;
        bookTitleEl.textContent = book.title;
        bookAuthorEl.textContent = book.author ? book.author.name : 'N/A';
        bookISBNEl.textContent = book.ISBN;
        bookGenreEl.textContent = book.genre ? book.genre.name : 'N/A';
        bookPublicationYearEl.textContent = book.publicationYear;
        bookDescriptionEl.textContent = book.description || 'No description available.';

        bookAvailabilityEl.textContent = book.availability ? 'Available' : 'Unavailable';
        bookAvailabilityEl.classList.remove('available', 'unavailable');
        bookAvailabilityEl.classList.add(book.availability ? 'available' : 'unavailable');

        editBookBtn.href = `add-book.html?id=${book._id}`;
        deleteBookBtn.dataset.id = book._id;
    }

    function showError(message) {
        bookDetailsLoadingEl.style.display = 'none';
        bookDetailsErrorEl.textContent = message;
        bookDetailsErrorEl.style.display = 'block';
    }

    deleteBookBtn.addEventListener('click', async (event) => {
        const currentBookId = event.target.dataset.id;
        const currentBookTitle = bookTitleEl.textContent;

        if (confirm(`Are you sure you want to delete the book "${currentBookTitle}"?`)) {
            try {
                const response = await fetch(`${API_BASE_URL}/books/${currentBookId}`, {
                    method: 'DELETE',
                });
                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.error || `HTTP error! status: ${response.status}`);
                }
                alert('Book deleted successfully! Redirecting to all books list.');
                window.location.href = 'all-books.html';
            } catch (error) {
                console.error('Failed to delete book:', error);
                alert(`Error deleting book: ${error.message}`);
            }
        }
    });

    fetchBookDetails();
}); 