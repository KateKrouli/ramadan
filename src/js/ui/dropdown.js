import { LOCATIONS } from "../config/locations"

export function initDropdown(onChange) {
  const select = document.getElementById("locationSelect")

  LOCATIONS.forEach(loc => {
    const opt = document.createElement("option")
    opt.value = loc.query
    opt.textContent = loc.label
    select.appendChild(opt)
  })

  select.addEventListener("change", () => {
    onChange(select.value)
  })

  onChange(select.value)
}
