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


// 1.在weeks的下面 新建week按钮
// 2.删去navbar中的week
// 3.category一个dropdown menu，底下常驻一个新建
// 4.每个week加一个归档、一个删除按钮，归档后没清空的自动归到下一周（新api）
// 5.tasks