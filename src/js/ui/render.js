export function renderTimer(html) {
  const el = document.getElementById("timer")
  if (!el) return

  el.innerHTML = html
}


export function renderQuote(text) {
  const el = document.getElementById("quote")
  if (!el) return

  el.textContent = `“${text}.”`
}
