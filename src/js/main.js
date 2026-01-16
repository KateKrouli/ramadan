/* ---------- Templates ---------- */

const title = `<h1 class="app__title" data-i18="app.title">Fasting Time</h1>`

const timer = `<div class="timer__container">
  <div id="timer" class="timer">00:00:00</div>
</div>`

const dropdown = `
<div class="dropdown" id="locationDropdown">
  <button class="dropdown__toggle" id="dropdownToggle">
    <span class="dropdown__value">Select location</span>
    <span class="dropdown__arrow">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
        <path d="M13 1L7 7L1 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
  </button>
  <div class="dropdown__menu-wrapper">
    <div class="dropdown__menu-content">
      <ul class="dropdown__menu" id="dropdownMenu"></ul>
    </div>
  </div>
</div>`

const quoteTpl = `<div id="quote" class="app__quote"></div>`
const dayTpl = `<div id="day" class="app__date"></div>`

/* ---------- Imports ---------- */

import { initDropdown } from "./ui/dropdown.js"
import { setMode } from "./ui/mode.js"
import { renderTimer, renderQuote } from "./ui/render.js"
import { getCoords } from "./api/location.js"
import { getPrayerTimes } from "./api/prayers.js"
import { startTimer } from "./core/timer.js"
import { state } from "./core/state.js"
import { pickDailyQuote } from "./core/quotes.js"
import { renderHolidayDay } from "./core/dayCounter.js"

/* ---------- Render layout ---------- */

const appElement = document.getElementById("app")
if (appElement) {
  // вставляем только внутреннее содержимое, без нового id="app"
  appElement.innerHTML = `
    <div class="app__overlay">
      ${title}
      <div class="app__content">
        ${dayTpl}
        ${dropdown}
      </div>
      ${timer}
      ${quoteTpl}
    </div>
  `
}

let timerId = null

/* ---------- Core logic ---------- */

async function loadCity(city) {
  try {
    const { lat, lon } = await getCoords(city)
    const { fajr, maghrib } = await getPrayerTimes(lat, lon)

    const now = new Date()
    const isNightNow = now > maghrib || now < fajr

    setMode(isNightNow ? "night" : "day")

    const target = isNightNow ? fajr : maghrib

    // Останавливаем старый таймер
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    }

    // Инициализация цитаты (1 раз в сутки)
    if (!state.lastFajrDate) {
      state.lastFajrDate = now.toISOString().slice(0, 10)
    }

    renderQuote(pickDailyQuote(state.lastFajrDate))
    
    // Рендер праздничного дня
    renderHolidayDay(now)

    // Запускаем таймер
    timerId = startTimer(target, renderTimer, () => {
      const now = new Date()
      const isNight = now > maghrib || now < fajr

      // Наступил Фаджр → новый день
      if (!isNight) {
        const today = now.toISOString().slice(0, 10)
        state.lastFajrDate = today

        renderQuote(pickDailyQuote(today))
        renderHolidayDay(now)
      }

      setMode(isNight ? "night" : "day")

      // Перезапуск цикла
      loadCity(city)
    })

  } catch (err) {
    console.error("Ошибка при загрузке города:", err)
    renderQuote(`Ошибка: город "${city}" не найден`)
    renderTimer("00:00:00")
  }
}

/* ---------- Init ---------- */

const now = new Date()
const fajrTime = new Date()
fajrTime.setHours(5, 30, 0)
const maghribTime = new Date()
maghribTime.setHours(17, 30, 0)

const isNightOnLoad = now > maghribTime || now < fajrTime
setMode(isNightOnLoad ? "night" : "day")

// Рендер праздничного дня сразу
renderHolidayDay(now)

// Инициализация dropdown
initDropdown(loadCity)
