const body = document.body;
const toggle = document.getElementById("theme-switch");
const favicon = document.getElementById("favicon");

function applySavedTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  const isLight = savedTheme === "light";

  body.classList.toggle("light-theme", isLight);
 

  if (toggle) toggle.checked = isLight;
}

function initThemeToggle() {
  if (!toggle) return; 
  toggle.addEventListener("change", () => {
    const newTheme = toggle.checked ? "light" : "dark";
    body.classList.toggle("light-theme", newTheme === "light");
    localStorage.setItem("theme", newTheme);
    
  });
}


function typeWriterStyled(element, text, speed = 80, colorVar = "--heading-color") {
  if (!element) return;
  let i = 0;

  function typing() {
    if (i < text.length) {
      const span = document.createElement("span");
      span.textContent = text.charAt(i);

      span.style.color =
        getComputedStyle(document.documentElement).getPropertyValue(colorVar) || "inherit";

      element.appendChild(span);
      i++;
      setTimeout(typing, speed);
    }
  }
  typing();
}

document.addEventListener("DOMContentLoaded", () => {
  applySavedTheme();
  initThemeToggle();

  const heading = document.getElementById("heading");
  const slogan = document.getElementById("slogan");

  const heading_text = "Willkommen zu unserer Bar!";

  typeWriterStyled(heading, heading_text, 80, "--heading-color");
  
  setTimeout(() => {
    typeWriterStyled(slogan, slogan_text, 50, "--slogan-color");
  }, heading_text.length * 80 + 200);
});
