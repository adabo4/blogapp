function deletePost(postId) {
    const isConfirmed = confirm("Are you sure you want to delete this post?");
    if (isConfirmed) {
        fetch(`/delete/${postId}`, { method: "DELETE" })
            .then(response => {
                if (!response.ok) throw new Error("Delete failed");
                return response.json();
            })
            .then(data => {

                window.location.href = "/";
            })
            .catch(error => console.error(error));
    }
}
