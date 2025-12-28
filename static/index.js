// Get weeks
(async () => {
    try {
        const response = await fetch("/api/weeks/all/", {credentials: "same-origin"});
        if (!response.ok){
            console.error("Failed to load weeks");
        }

        const weeks = await response.json();
        const weeklist = document.getElementById("week-list");

        weeklist.innerHTML = "";

        weeks.forEach(week => {
            const li = document.createElement("li");
            li.innerText = week.name
            li.dataset.weekId = week.id;
            weeklist.appendChild(li);
        });
    } catch (error) {
        console.error("Error loading weeks:", error);
    }
})();

// New week popup
const newWeekForm = document.getElementById("newWeek");
const modal = document.getElementById("modal");

newWeekForm.addEventListener("submit", e => {
    e.preventDefault();
    modal.classList.add("show");
});

document.getElementById("cancel").onclick = () => {
    modal.classList.remove("show");
};

document.getElementById("confirm").onclick = async () => {
    const name = document.getElementById("weekname").value.trim();
    const start = document.getElementById("week-start").value;
    const end = document.getElementById("week-end").value;

    if (!name || !start || !end) {
        alert("Please fill in all fields");
        return;
    }

    try {
        const response = await fetch("/api/week/create", {
            method: "POST",
            credentials: "same-origin",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name: name,
                start_time: start,
                end_time: end
            })
        });

        if (!response.ok) {
            throw new Error("Failed to create new week")
        }

        modal.classList.remove("show");

        location.reload();
    } catch (error) {
        console.error(error);
        alert("Error creating week");
    }
};



// 1.在weeks的下面 新建week按钮
// 2.删去navbar中的week
// 3.category一个dropdown menu，底下常驻一个新建
// 4.每个week加一个归档、一个删除按钮、一个重命名，归档后没清空的自动归到下一周（新api），已归档的放入下面折叠起来
// 5.tasks
// 6.navbar中的用户名点击形成一个dropdown menu，里面有logout和改密码