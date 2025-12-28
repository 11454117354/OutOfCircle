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

                const template = document.getElementById("category-modal-template");
                const modal = template.cloneNode(true);
                modal.id = "";
                modal.style.display = "flex";
                document.body.appendChild(modal);

                modal.querySelector("#modal-title").innerText = "Rename Category";
                const nameInput = modal.querySelector(".popup-category-name");
                const colorInput = modal.querySelector(".popup-category-color");
                nameInput.value = category.name;
                colorInput.value = category.color;

                modal.querySelector(".popup-cancel").onclick = () => modal.remove();

                modal.querySelector(".popup-confirm").onclick = async () => {
                    const newName = nameInput.value.trim();
                    const newColor = colorInput.value;

                    if (!newName) {
                        alert("Please fill in a name");
                        return;
                    }

                    if (!newColor) {
                        alert("Please select a color");
                        return;
                    }

                    try {
                        const response = await fetch(`/api/categories/${category.id}/edit/`, {
                            method: "PATCH",
                            credentials: "same-origin",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ name: newName, color: newColor })
                        });

                        if (!response.ok) throw new Error();
                        modal.remove();
                        location.reload();
                    } catch {
                        alert("Error renaming category");
                    }
                };
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
const categoryList = document.getElementById("category-list");

newCategoryForm.addEventListener("submit", e => {
    e.preventDefault();

    const template = document.getElementById("category-modal-template");
    const modal = template.cloneNode(true);
    modal.id = "";                // 去掉 id
    modal.style.display = "flex"; // 显示弹窗
    document.body.appendChild(modal);

    modal.querySelector("#modal-title").innerText = "New Category";
    const nameInput = modal.querySelector(".popup-category-name");
    const colorInput = modal.querySelector(".popup-category-color");
    nameInput.value = "";
    colorInput.value = "#2274F8";

    modal.querySelector(".popup-cancel").onclick = () => modal.remove();

    modal.querySelector(".popup-confirm").onclick = async () => {
        const name = nameInput.value.trim();
        const color = colorInput.value;

        if (!name) {
            alert("Please fill in a name");
            return;
        }

        try {
            const response = await fetch("/api/category/create", {
                method: "POST",
                credentials: "same-origin",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, color })
            });

            if (!response.ok) throw new Error("Failed to create category");
            modal.remove();
            location.reload();
        } catch {
            alert("Error creating category");
        }
    };
});