// Функция соединения с роботом
function connectToRobot() {
    const uuid = prompt("UUID:");
    const ip = prompt("IP:");
    const model = prompt("Model:");
    const releaseDate = prompt("Release Date:");

    if (!uuid || !ip || !model) return;

    const robotData = { uuid, ip, model, releaseDate };

    // Сохраняем на сервер
    fetch("save_robots.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(robotData)
    })
    .then(res => res.json())
    .then(resp => {
        if (resp.status === "success") {
            alert("Robot saved on server!");
            displayRobots();
        } else {
            alert("Error: " + resp.message);
        }
    })
    .catch(err => alert("Failed to save robot on server"));

    // Локальное хранение тоже можно оставить
    let robots = JSON.parse(localStorage.getItem("robots")) || [];
    robots.push(robotData);
    localStorage.setItem("robots", JSON.stringify(robots));
}

// Отображение роботов
function displayRobots() {
    let robots = JSON.parse(localStorage.getItem("robots")) || [];
    const list = document.getElementById("robotList");
    list.innerHTML = "";

    robots.forEach(robot => {
        const li = document.createElement("li");

        const name = document.createElement("span");
        name.textContent = robot.model;

        name.addEventListener("click", () => {
            let info = li.querySelector(".robot-info");
            if (!info) {
                info = document.createElement("div");
                info.className = "robot-info";
                info.innerHTML = `
                    <strong>UUID:</strong> ${robot.uuid}<br>
                    <strong>IP:</strong> ${robot.ip}<br>
                    <strong>Release Date:</strong> ${robot.releaseDate}
                `;
                li.appendChild(info);
            } else {
                li.removeChild(info);
            }
        });

        li.appendChild(name);

        const del = document.createElement("button");
        del.textContent = "Delete";
        del.onclick = (e) => {
            e.stopPropagation();
            if (confirm("Delete this robot?")) {
                deleteRobot(robot.uuid);
            }
        };
        li.appendChild(del);

        list.appendChild(li);
    });
}

// Удаление робота
function deleteRobot(uuid) {
    let robots = JSON.parse(localStorage.getItem("robots")) || [];
    robots = robots.filter(r => r.uuid !== uuid);
    localStorage.setItem("robots", JSON.stringify(robots));
    displayRobots();
}

// Скачивание прошивки
function downloadFirmware() {
    const link = document.createElement("a");
    link.href = "SkyNET CreateTool.bat";
    link.download = "SkyNET CreateTool.bat";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

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

// Инициализация
displayRobots();