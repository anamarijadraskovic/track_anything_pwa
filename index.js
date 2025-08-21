import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js"
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js"

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

onValue(referenceInDB, function (snapshot) {
    const snapshotValues = snapshot.val()
    const leads = Object.values(snapshotValues)
    render(leads)
})

function render(leads) {
    let listItems = ""
    for (let i = 0; i < leads.length; i++) {
        listItems += `
            <li>
                <a target='_blank' href='${leads[i]}'>
                    ${leads[i]}
                </a>
            </li>
        `
    }
    ulEl.innerHTML = listItems
}

deleteBtn.addEventListener("dblclick", function() {

})

inputBtn.addEventListener("click", function() {
    push(referenceInDB, inputEl.value)
    console.log(inputEl.value)
    inputEl.value = ""
})
