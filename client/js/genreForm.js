document.addEventListener('DOMContentLoaded', () => {
    const genreForm = document.getElementById('genreForm');
    const genreIdInput = document.getElementById('genreId');
    const nameInput = document.getElementById('name');
    const descriptionInput = document.getElementById('description');
    const pageTitle = document.getElementById('pageTitle');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const formMessageEl = document.getElementById('formMessage');

    const urlParams = new URLSearchParams(window.location.search);
    const currentGenreId = urlParams.get('id');
    let isEditMode = false;

    if (currentGenreId) {
        isEditMode = true;
        pageTitle.textContent = 'Edit Genre';
        submitBtn.textContent = 'Update Genre';
        genreIdInput.value = currentGenreId;
        fetchGenreDetails(currentGenreId);
    }

    async function fetchGenreDetails(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/genres/${id}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            const genre = await response.json();
            nameInput.value = genre.name;
            descriptionInput.value = genre.description || '';
        } catch (error) {
            console.error('Failed to fetch genre details:', error);
            displayFormMessage(`Error loading genre details: ${error.message}. Please go back.`, 'error');
            submitBtn.disabled = true;
        }
    }

    function displayFormMessage(message, type) {
        formMessageEl.textContent = message;
        formMessageEl.className = `form-message ${type}`;
        formMessageEl.style.display = 'block';
    }

    genreForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        formMessageEl.style.display = 'none';

        const genreData = {
            name: nameInput.value.trim(),
            description: descriptionInput.value.trim()
        };

        if (!genreData.name) {
            displayFormMessage('Genre name is required.', 'error');
            return;
        }

        let url = `${API_BASE_URL}/genres`;
        let method = 'POST';

        if (isEditMode) {
            url = `${API_BASE_URL}/genres/${currentGenreId}`;
            method = 'PUT';
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(genreData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || `HTTP error! status: ${response.status}`);
            }

            const successMessage = isEditMode ? 'Genre updated successfully!' : 'Genre added successfully!';
            displayFormMessage(`${successMessage} Redirecting...`, 'success');

            setTimeout(() => {
                window.location.href = 'genres.html';
            }, 1500);

        } catch (error) {
            console.error(`Failed to ${isEditMode ? 'update' : 'add'} genre:`, error);
            displayFormMessage(`Error: ${error.message}`, 'error');
        }
    });

    cancelBtn.addEventListener('click', () => {
        window.location.href = 'genres.html';
    });
}); 