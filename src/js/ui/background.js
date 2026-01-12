export function setBackground(mode) {
  const app = document.getElementById("app")
  app.style.backgroundImage =
    mode === "night"
      ? "url(/assets/night.jpg)"
      : "url(/assets/day.jpg)"
}
