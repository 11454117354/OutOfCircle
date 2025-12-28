// Get categories
(async () => {
    try {
        const response = await fetch("/api/categories/all", { credentials: "same-origin" });
        if (!response.ok) {
            console.error("Failed to load categories");
            return;
        }

        const categories = await response.json();
        const categoryList = document.getElementById("category-list");
        categoryList.innerHTML = "";

        categories.forEach(category => {
            const li = document.createElement("li");
            li.classList.add("week-item");
            li.dataset.categoryId = category.id;

            const nameSpan = document.createElement("span");
            nameSpan.innerText = category.name;
            nameSpan.style.color = category.color;

            const renameBtn = document.createElement("button");
            renameBtn.innerText = "E";
            renameBtn.classList.add("rename-btn");

            const deleteBtn = document.createElement("button");
            deleteBtn.innerText = "D";
            deleteBtn.classList.add("delete-btn");

            /* ---------- Rename ---------- */
            renameBtn.addEventListener("click", e => {
                e.stopPropagation();

                const newName = prompt("Enter new category name", category.name);
                if (!newName) return;

                fetch(`/api/categories/${category.id}/edit/`, {
                    method: "PATCH",
                    credentials: "same-origin",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: newName })
                })
                .then(res => {
                    if (!res.ok) throw new Error();
                    location.reload();
                })
                .catch(() => alert("Error renaming category"));
            });

            /* ---------- Delete ---------- */
            deleteBtn.addEventListener("click", async e => {
                e.stopPropagation();

                const choice = confirm(
                    "OK: delete category and ALL tasks\nCancel: move tasks to another category"
                );

                let destinationId = -1;

                if (!choice) {
                    const target = prompt("Enter destination category ID");
                    if (!target) return;
                    destinationId = target;
                }

                try {
                    const response = await fetch(
                        `/api/categories/${category.id}/${destinationId}`,
                        {
                            method: "DELETE",
                            credentials: "same-origin"
                        }
                    );

                    if (!response.ok) throw new Error();
                    li.remove();
                } catch {
                    alert("Error deleting category");
                }
            });

            li.appendChild(nameSpan);
            li.appendChild(renameBtn);
            li.appendChild(deleteBtn);
            categoryList.appendChild(li);
        });
    } catch (error) {
        console.error("Error loading categories:", error);
    }
})();

/* ---------- Add New Category ---------- */
const newCategoryForm = document.getElementById("newCategory");

newCategoryForm.addEventListener("submit", async e => {
    e.preventDefault();

    const name = prompt("Category name:");
    if (!name) return;

    const color = prompt("Category color (e.g. #2274F8):", "#2274F8");
    if (!color) return;

    try {
        const response = await fetch("/api/category/create", {
            method: "POST",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, color })
        });

        if (!response.ok) throw new Error();
        location.reload();
    } catch {
        alert("Error creating category");
    }
});