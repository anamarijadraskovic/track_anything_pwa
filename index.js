window.addEventListener("DOMContentLoaded", async () => {
  const [{ initializeApp }, { getDatabase, ref, push, onValue, remove }] =
    await Promise.all([
      import("https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js"),
    ]);

  // Your web app's Firebase configuration
  const firebaseConfig = {
    databaseURL: CONFIG.DATABASE_URL,
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  // Reference is a specific location in the database where we can push data
  const referenceInDB = ref(database, "item");

  const inputEl = document.getElementById("input-el");
  const inputBtn = document.getElementById("input-btn");
  const ulEl = document.getElementById("ul-el");
  const deleteBtn = document.getElementById("delete-btn");
  const changeThemeBtn = document.getElementById("change-theme-btn");
  const root = document.documentElement;

  // Firebase event
  onValue(referenceInDB, (snapshot) => {
    if (snapshot.exists()) {
      const leads = Object.values(snapshot.val());
      render(leads);
    } else {
      ulEl.innerHTML = "";
    }
  });

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

  // Save input
  inputBtn.addEventListener("click", () => {
    const value = inputEl.value.trim();
    if (value) {
      push(referenceInDB, value);
      inputEl.value = "";
    } else {
      alert("Please enter a valid value before adding!");
    }
  });

  // Delete all
  deleteBtn.addEventListener("click", () => {
    remove(referenceInDB);
    ulEl.innerHTML = "";
  });

  // THEME SWITCHING
  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
  }

  // Get stored theme OR system preference
  let theme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");
  applyTheme(theme);
  // Toggle button
  changeThemeBtn.addEventListener("click", () => {
    theme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem("theme", theme);
    applyTheme(theme);
  });

  // Listen for system changes if user hasn't selected a theme
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        applyTheme(e.matches ? "dark" : "light");
      }
    });
});
