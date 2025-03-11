document.addEventListener("DOMContentLoaded", () => {
    const imageInput = document.getElementById("summaryImageUpload");
    const imagePreview = document.getElementById("summaryImagePreview");
    const hiddenInput = document.getElementById("hiddenSummaryImage");
    const deleteImgBtn = document.querySelector(".xmark");

    if (!imageInput || !imagePreview || !hiddenInput || !deleteImgBtn) return;

    deleteImgBtn.addEventListener("click", () => {
        imagePreview.src = "";
        imagePreview.style.display = "none"; // Hide image preview
        deleteImgBtn.style.display = "none"; // Hide delete button
        hiddenInput.value = ""; // Clear hidden input value
    })

    imageInput.addEventListener("change", function () {
        const file = this.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = function (event) {
            const base64Image = event.target.result.split(",")[1]; // Extract only base64 part
            const fileName = `summary_${Date.now()}_${file.name}`;

            // Show preview immediately
            imagePreview.src = event.target.result;
            imagePreview.style.display = "block";
            deleteImgBtn.style.display = "block";

            // Upload image
            fetch("/upload-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ base64Image, fileName }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.imageUrl) {
                        imagePreview.src = data.imageUrl;
                        hiddenInput.value = data.imageUrl;
                    }
                })
                .catch(err => console.error("Upload failed:", err));
        };
    });
});
