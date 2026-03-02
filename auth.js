async function hash(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map(x => x.toString(16).padStart(2, "0")).join("");
}

async function register() {
    let u = prompt("Username:");
    let p = prompt("Password:");
    let role = prompt("Role: admin or operator", "operator");

    if (!u || !p) return;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find(x => x.u === u)) {
        alert("User exists");
        return;
    }

    let hp = await hash(p);

    users.push({u, p: hp, role});
    localStorage.setItem("users", JSON.stringify(users));

    alert("Created!");
}

async function login() {
    let u = prompt("Username:");
    let p = prompt("Password:");

    let hp = await hash(p);
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(x => x.u === u && x.p === hp);

    if (user) {
        localStorage.setItem("currentUser", u);
        localStorage.setItem("role", user.role);
        location.href = "app.html";
    } else {
        alert("Wrong!");
    }
}

function logout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("role");
    location.href = "index.html";
}

if (location.pathname.includes("app") && !localStorage.getItem("currentUser")) {
    location.href = "index.html";
}