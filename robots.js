function getKey() {
    return "robots_" + localStorage.getItem("currentUser");
}

// Подключение нового робота
function connectToRobot() {
    let uuid = prompt("UUID:");
    let ip = prompt("IP:");
    let model = prompt("Model:");
    let date = prompt("Release date:");

    if (!uuid || !ip || !model) return;

    let robots = JSON.parse(localStorage.getItem(getKey())) || [];
    robots.push({uuid, ip, model, date});
    localStorage.setItem(getKey(), JSON.stringify(robots));
    displayRobots();
}

// Отображение всех роботов
function displayRobots() {
    let robots = JSON.parse(localStorage.getItem(getKey())) || [];
    let list = document.getElementById("robotList");
    let q = document.getElementById("search")?.value?.toLowerCase() || "";

    list.innerHTML = "";

    robots
        .filter(r => r.model.toLowerCase().includes(q))
        .forEach(robot => {
            let li = document.createElement("li");

            // Название робота сверху
            let name = document.createElement("span");
            name.textContent = robot.model;
            name.style.fontWeight = "bold";
            name.style.cursor = "pointer";

            // Клик по названию — раскрытие информации
            name.addEventListener("click", function() {
                let infoDiv = li.querySelector(".robot-info");
                if (!infoDiv) {
                    infoDiv = document.createElement("div");
                    infoDiv.className = "robot-info";
                    infoDiv.style.marginTop = "8px";
                    infoDiv.style.fontSize = "14px";
                    infoDiv.innerHTML = `
                        <strong>UUID:</strong> ${robot.uuid}<br>
                        <strong>IP:</strong> ${robot.ip}<br>
                        <strong>Release Date:</strong> ${robot.date}<br>
                        <strong>Model:</strong> ${robot.model}
                    `;
                    li.appendChild(infoDiv);
                } else {
                    li.removeChild(infoDiv); // toggle
                }
            });

            li.appendChild(name);

            // Кнопка Delete для админа
            let role = localStorage.getItem("role");
            if (role === "admin") {
                let del = document.createElement("button");
                del.textContent = "🗑 Delete";
                del.style.background = "#dc3545";
                del.onclick = (e) => {
                    e.stopPropagation();
                    if (confirm("Delete this robot?")) {
                        deleteRobot(robot.uuid);
                    }
                };
                li.appendChild(del);
            }

            list.appendChild(li);
        });
}

// Удаление робота
function deleteRobot(uuid) {
    let robots = JSON.parse(localStorage.getItem(getKey())) || [];
    robots = robots.filter(r => r.uuid !== uuid);
    localStorage.setItem(getKey(), JSON.stringify(robots));
    displayRobots();
}

// Скачивание обычной прошивки
function downloadFirmware() {
    const link = document.createElement("a");
    link.href = "SkyNET%20CreateTool.bat";
    link.download = "SkyNET CreateTool.bat";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Обновление прошивки с “оплатой” и скачиванием Pro
function updateFirmware() {
    let confirmPay = confirm("To update the firmware, you need to pay $50. Proceed?");
    if (!confirmPay) return;

    let name = prompt("Enter your name for payment confirmation:");
    if (!name) {
        alert("Payment cancelled!");
        return;
    }

    alert(`💳 Payment successful! Thank you, ${name}.`);

    const link = document.createElement("a");
    link.href = "SkyNET%20CreateTool%20Pro.bat";
    link.download = "SkyNET CreateTool Pro.bat";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Тёмная тема
function toggleTheme() {
    document.body.classList.toggle("dark");
}

// Экспорт данных
function exportData() {
    let data = localStorage.getItem(getKey()) || "[]";
    let blob = new Blob([data], {type: "application/json"});
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "robots_backup.json";
    a.click();
}

// Импорт данных
function importData() {
    let input = document.createElement("input");
    input.type = "file";
    input.onchange = e => {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onload = () => {
            localStorage.setItem(getKey(), reader.result);
            displayRobots();
        };
        reader.readAsText(file);
    };
    input.click();
}