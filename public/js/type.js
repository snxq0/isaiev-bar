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