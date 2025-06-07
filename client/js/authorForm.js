document.addEventListener('DOMContentLoaded', () => {
    const authorForm = document.getElementById('authorForm');
    const authorIdInput = document.getElementById('authorId');
    const nameInput = document.getElementById('name');
    const bioInput = document.getElementById('bio');
    const pageTitle = document.getElementById('pageTitle');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const formMessageEl = document.getElementById('formMessage');

    const urlParams = new URLSearchParams(window.location.search);
    const currentAuthorId = urlParams.get('id');
    let isEditMode = false;

    if (currentAuthorId) {
        isEditMode = true;
        pageTitle.textContent = 'Edit Author';
        submitBtn.textContent = 'Update Author';
        authorIdInput.value = currentAuthorId;
        fetchAuthorDetails(currentAuthorId);
    }

    async function fetchAuthorDetails(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/authors/${id}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            const author = await response.json();
            nameInput.value = author.name;
            bioInput.value = author.bio || '';
        } catch (error) {
            console.error('Failed to fetch author details:', error);
            displayFormMessage(`Error loading author details: ${error.message}. Please go back.`, 'error');
            submitBtn.disabled = true;
        }
    }

    function displayFormMessage(message, type) {
        formMessageEl.textContent = message;
        formMessageEl.className = `form-message ${type}`;
        formMessageEl.style.display = 'block';
    }

    authorForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        formMessageEl.style.display = 'none';

        const authorData = {
            name: nameInput.value.trim(),
            bio: bioInput.value.trim()
        };

        if (!authorData.name) {
            displayFormMessage('Author name is required.', 'error');
            return;
        }

        let url = `${API_BASE_URL}/authors`;
        let method = 'POST';

        if (isEditMode) {
            url = `${API_BASE_URL}/authors/${currentAuthorId}`;
            method = 'PUT';
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(authorData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || `HTTP error! status: ${response.status}`);
            }

            const successMessage = isEditMode ? 'Author updated successfully!' : 'Author added successfully!';
            displayFormMessage(`${successMessage} Redirecting...`, 'success');

            setTimeout(() => {
                window.location.href = 'authors.html';
            }, 1500);

        } catch (error) {
            console.error(`Failed to ${isEditMode ? 'update' : 'add'} author:`, error);
            displayFormMessage(`Error: ${error.message}`, 'error');
        }
    });

    cancelBtn.addEventListener('click', () => {
        window.location.href = 'authors.html';
    });
}); 