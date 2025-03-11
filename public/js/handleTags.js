document.addEventListener('DOMContentLoaded', () => {
    const tagInput = document.getElementById('tagInput');
    const tagContainer = document.getElementById('tagContainer');
    const tagsDiv = document.getElementById('tags');

    // If tags exist in input, display them as tags
    tagInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault();
            const tag = tagInput.value.trim();
            if (tag && !tagsDiv.innerHTML.includes(tag)) {
                const tagElement = document.createElement('span');
                tagElement.classList.add('tag');
                tagElement.textContent = tag;

                tagsDiv.appendChild(tagElement);

                // Clear input
                tagInput.value = '';
            }
        }
    });

    // Convert tags div to a hidden input for form submission
    document.querySelector('form').addEventListener('submit', () => {
        const tags = Array.from(tagsDiv.children).map(tag => tag.textContent);
        document.getElementById('tagInput').value = tags.join(', ');
    });
});
