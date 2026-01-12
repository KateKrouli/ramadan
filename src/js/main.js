import app from "../components/app.html" assert { type: "text" }
import timer from "../components/timer.html" assert { type: "text" }
import dropdown from "../components/dropdown.html" assert { type: "text" }
import quoteTpl from "../components/quote.html" assert { type: "text" }

import { initDropdown } from "./ui/dropdown"
import { setBackground } from "./ui/background"
import { renderTimer, renderQuote } from "./ui/render"
import { getCoords } from "./api/location"
import { getPrayerTimes } from "./api/prayers"
import { startTimer } from "./core/timer"
import { state } from "./core/state"
import { pickDailyQuote } from "./core/quotes"

/* ---------- Render layout ---------- */
document.getElementById("root").innerHTML = app
  .replace("{{timer}}", timer)
  .replace("{{dropdown}}", dropdown)
  .replace("{{quote}}", quoteTpl)

let timerId = null

/* ---------- Core logic ---------- */
async function loadCity(city) {
  try {
    const { lat, lon } = await getCoords(city)
    const { fajr, maghrib } = await getPrayerTimes(lat, lon)

    const now = new Date()
    const isNightNow = now > maghrib || now < fajr

    setBackground(isNightNow ? "night" : "day")

    const target = isNightNow ? fajr : maghrib

    if (timerId) {
      clearInterval(timerId)
      timerId = null
    }

    if (!state.lastFajrDate) {
      state.lastFajrDate = now.toISOString().slice(0, 10)
    }

    renderQuote(pickDailyQuote(state.lastFajrDate))

    timerId = startTimer(target, renderTimer, () => {
      const now = new Date()
      const isNight = now > maghrib || now < fajr

      // Если наступил Фаджр → обновляем цитату
      if (!isNight) {
        const today = now.toISOString().slice(0, 10)
        state.lastFajrDate = today
        renderQuote(pickDailyQuote(today))
      }

      setBackground(isNight ? "night" : "day")

      // Перезапускаем цикл
      loadCity(city)
    })
  } catch (err) {
    console.error("Ошибка при загрузке города:", err)
    renderQuote(`Ошибка: город "${city}" не найден`)
    renderTimer("00:00:00")
  }
}

/* ---------- Init ---------- */
initDropdown(loadCity)
