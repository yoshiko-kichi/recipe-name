// Page navigation
const pages = {
    upload: document.getElementById('uploadPage'),
    suggestion: document.getElementById('suggestionPage'),
    history: document.getElementById('historyPage')
};

let currentImage = null;
let currentSuggestions = [];

// Navigate to a specific page
function navigateTo(pageName) {
    Object.values(pages).forEach(page => page.classList.remove('active'));
    pages[pageName].classList.add('active');

    // Update footer visibility
    const historyLink = document.getElementById('historyLink');
    const backLink = document.getElementById('backToUpload');

    if (pageName === 'upload') {
        historyLink.style.display = 'inline';
        backLink.style.display = 'none';
    } else {
        historyLink.style.display = pageName === 'history' ? 'none' : 'inline';
        backLink.style.display = pageName === 'upload' ? 'none' : 'inline';
    }
}

// File input handling
const fileInput = document.getElementById('fileInput');
const uploadLabel = document.querySelector('.upload-label');
const generateBtn = document.getElementById('generateBtn');
const previewContainer = document.getElementById('previewContainer');
const imagePreview = document.getElementById('imagePreview');

// File selection - label's 'for' attribute handles the click automatically
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleFileUpload(file);
    }
});

// Drag and drop
uploadLabel.addEventListener('dragover', (e) => {
    e.preventDefault();
});

uploadLabel.addEventListener('drop', (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleFileUpload(file);
    }
});

function handleFileUpload(file) {
    currentImage = file;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
        previewContainer.style.display = 'block';
        generateBtn.disabled = false;
    };
    reader.readAsDataURL(file);
}

// Generate dish names
generateBtn.addEventListener('click', async () => {
    if (!currentImage) return;

    generateBtn.disabled = true;
    generateBtn.textContent = '[ Generating... ]';

    try {
        const formData = new FormData();
        formData.append('image', currentImage);

        const response = await fetch('/api/generate-names', {
            method: 'POST',
            body: formData
        });

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Server error. Please try again.');
        }

        const data = await response.json();

        if (data.success) {
            currentSuggestions = data.names;
            displaySuggestions(imagePreview.src);
            navigateTo('suggestion');
        } else {
            alert('Error: ' + (data.error || 'Failed to generate names'));
        }
    } catch (error) {
        alert('Error: ' + error.message);
        console.error('Full error:', error);
    } finally {
        generateBtn.disabled = false;
        generateBtn.textContent = '[ Generate Dish Names ]';
    }
});

// Display suggestions
function displaySuggestions(imageSrc) {
    // Show thumbnail
    const thumbnailContainer = document.getElementById('dishThumbnail');
    thumbnailContainer.innerHTML = `<img src="${imageSrc}" alt="Dish">`;

    // Show name options
    const nameOptions = document.getElementById('nameOptions');
    nameOptions.innerHTML = '';

    currentSuggestions.forEach((name, index) => {
        const button = document.createElement('button');
        button.className = 'name-option';
        button.textContent = `(${index + 1}) [ ${name} ]`;
        button.addEventListener('click', () => selectName(name, imageSrc));
        nameOptions.appendChild(button);
    });

    // Hide confirmation
    document.getElementById('confirmationMessage').style.display = 'none';
}

// Select a name
async function selectName(name, imageSrc) {
    try {
        const response = await fetch('/api/save-selection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                image: imageSrc,
                suggestions: currentSuggestions
            })
        });

        const data = await response.json();

        if (data.success) {
            // Show confirmation
            const confirmation = document.getElementById('confirmationMessage');
            confirmation.textContent = `Saved as: ${name}`;
            confirmation.style.display = 'block';

            // Auto-redirect after 2 seconds
            setTimeout(() => {
                resetUploadPage();
                navigateTo('upload');
            }, 2000);
        }
    } catch (error) {
        alert('Error saving selection: ' + error.message);
    }
}

// Regenerate suggestions
document.getElementById('regenerateBtn').addEventListener('click', async () => {
    const regenerateBtn = document.getElementById('regenerateBtn');
    regenerateBtn.disabled = true;
    regenerateBtn.textContent = '[ Regenerating... ]';

    try {
        const formData = new FormData();
        formData.append('image', currentImage);

        const response = await fetch('/api/generate-names', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            currentSuggestions = data.names;
            displaySuggestions(imagePreview.src);
        }
    } catch (error) {
        alert('Error regenerating names: ' + error.message);
    } finally {
        regenerateBtn.disabled = false;
        regenerateBtn.textContent = '[ Regenerate Suggestions ]';
    }
});

// History page
document.getElementById('historyLink').addEventListener('click', (e) => {
    e.preventDefault();
    loadHistory();
    navigateTo('history');
});

async function loadHistory() {
    try {
        const response = await fetch('/api/history');
        const data = await response.json();

        const historyList = document.getElementById('historyList');

        if (data.history && data.history.length > 0) {
            historyList.innerHTML = data.history.map((item, index) => `
                <div class="history-item">
                    <img src="${item.image}" alt="Dish">
                    <span>${index + 1}. ${item.name} (${new Date(item.date).toLocaleDateString()})</span>
                </div>
            `).join('');
        } else {
            historyList.innerHTML = '<div class="history-empty">No dishes named yet.</div>';
        }
    } catch (error) {
        alert('Error loading history: ' + error.message);
    }
}

// Back buttons
document.getElementById('backToUpload').addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('upload');
});

document.getElementById('backToUploadFromHistory').addEventListener('click', () => {
    navigateTo('upload');
});

// Reset upload page
function resetUploadPage() {
    currentImage = null;
    fileInput.value = '';
    previewContainer.style.display = 'none';
    generateBtn.disabled = true;
}

// Initialize
navigateTo('upload');
