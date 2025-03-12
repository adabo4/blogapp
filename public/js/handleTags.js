document.addEventListener("DOMContentLoaded", () => {
    const tagInput = document.getElementById("tagInput");
    const tagContainer = document.getElementById("tagContainer");
    const tagsDiv = document.getElementById("tags");
    const form = document.querySelector("form");

    if (!tagInput || !tagsDiv || !form) {
        console.warn("Tag.js: One or more elements not found, skipping script.");
        return; // Stop execution if elements are missing
    }

    // If tags exist in input, display them as tags
    tagInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            const tag = tagInput.value.trim();
            if (tag && !tagsDiv.innerHTML.includes(tag)) {
                const tagElement = document.createElement("span");
                tagElement.classList.add("tag");
                tagElement.textContent = tag;
                tagsDiv.appendChild(tagElement);
                tagInput.value = ""; // Clear input
            }
        }
    });

    // Convert tags div to a hidden input for form submission
    form.addEventListener("submit", () => {
        const tags = Array.from(tagsDiv.children).map((tag) => tag.textContent);
        tagInput.value = tags.join(", ");
    });
});
