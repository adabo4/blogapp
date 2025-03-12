



function deletePost(postId) {
    const isConfirmed = confirm("Are you sure you want to delete this post?");
    if (isConfirmed) {
        fetch(`/delete/${postId}`, { method: "DELETE" })
            .then(response => {
                if (!response.ok) throw new Error("Delete failed");
                return response.text();
            })
            .then(() => {
                window.location.href = "/"; // Refresh the page to show the updated list
            })
            .catch(error => console.error(error));
    }
}

