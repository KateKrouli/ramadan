import { LOCATIONS } from "../config/locations.js"
import { i18n } from "../i18n/index.js"

export function initDropdown(onSelect) {
  const dropdown = document.getElementById("locationDropdown")
  const toggle = document.getElementById("dropdownToggle")
  const valueEl = toggle.querySelector(".dropdown__value")
  const menu = document.getElementById("dropdownMenu")

  if (!dropdown || !toggle || !menu) return

  /* ---------- Render items ---------- */

  LOCATIONS.forEach(({ label, query }) => {
    const item = document.createElement("li")
    item.className = "dropdown__item"
    item.textContent = label 
    item.dataset.query = query

    item.addEventListener("click", () => {
      valueEl.textContent = label
      closeDropdown()
      onSelect(query)
    })

    menu.appendChild(item)
  })

  /* ---------- Toggle ---------- */

  toggle.addEventListener("click", (e) => {
    e.stopPropagation()
    dropdown.classList.toggle("dropdown--open")
  })

  /* ---------- Close on outside click ---------- */

  document.addEventListener("click", () => {
    closeDropdown()
  })

  function closeDropdown() {
    dropdown.classList.remove("dropdown--open")
  }

  /* ---------- Init default ---------- */

  if (LOCATIONS.length) {
    const savedLocation = localStorage.getItem("selectedLocation")
    const locationToUse = LOCATIONS.find(loc => loc.query === savedLocation) || LOCATIONS[0]
    valueEl.textContent = locationToUse.label
    onSelect(locationToUse.query)
  }
}
