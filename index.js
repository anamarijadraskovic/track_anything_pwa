import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js"

// Your web app's Firebase configuration
const firebaseConfig = {
    databaseURL: CONFIG.DATABASE_URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
// Reference is a specific location in the database where we can push data
const referenceInDB = ref(database, "item")

const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")
const changeThemeBtn = document.getElementById("change-theme-btn");
const root = document.documentElement;

onValue(referenceInDB, function (snapshot) {
    if (snapshot.exists()) {
        const snapshotValues = snapshot.val()
        const leads = Object.values(snapshotValues)
        render(leads)
    }
})

function render(leads) {
    ulEl.innerHTML = "";
    leads.forEach((lead) => {
        const li = document.createElement("li");
        const a = document.createElement("a");

        a.target = "_blank";
        a.href = lead;
        a.textContent = lead;

        li.appendChild(a);
        ulEl.appendChild(li);
    });
}

inputBtn.addEventListener("click", function () {
    push(referenceInDB, inputEl.value)
    inputEl.value = ""
})

deleteBtn.addEventListener("click", function () {
    remove(referenceInDB)
    ulEl.innerHTML = ""
})

changeThemeBtn.addEventListener("click", () => {
    if (root.getAttribute("data-theme") === "dark") {
        root.removeAttribute("data-theme"); // back to light
        localStorage.setItem("theme", "light");
    } else {
        root.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
    }
});
