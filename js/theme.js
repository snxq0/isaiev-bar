const body = document.body;
const toggle = document.getElementById("theme-switch");
const favicon = document.getElementById("favicon");

function setFavicon(theme) {
  if (!favicon) return;
  favicon.href =
    theme === "dark"
      ? "assets/favicons/image 3.png"
      : "assets/favicons/favicon-light.png";
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  const isLight = savedTheme === "light";

  body.classList.toggle("light-theme", isLight);
  setFavicon(savedTheme);

  if (toggle) toggle.checked = isLight;
}

function initThemeToggle() {
  if (!toggle) return; 
  toggle.addEventListener("change", () => {
    const newTheme = toggle.checked ? "light" : "dark";
    body.classList.toggle("light-theme", newTheme === "light");
    localStorage.setItem("theme", newTheme);
    setFavicon(newTheme);
  });
}