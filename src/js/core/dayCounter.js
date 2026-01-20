/* core/dayCounter.js */

export const HOLIDAY_START_DATE = "2026-03-11"
export const HOLIDAY_TOTAL_DAYS = 30

function normalizeDate(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/* ---------- Holiday day ---------- */

export function getHolidayDayNumber(currentDate = new Date()) {
  const start = normalizeDate(HOLIDAY_START_DATE)
  const current = normalizeDate(currentDate)

  const diffDays = Math.floor(
    (current - start) / (1000 * 60 * 60 * 24)
  )

  const dayNumber = diffDays + 1

  if (dayNumber < 1) return 1
  if (dayNumber > HOLIDAY_TOTAL_DAYS) return HOLIDAY_TOTAL_DAYS

  return dayNumber
}

/* ---------- Date formatting ---------- */

function formatFullDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  })
}

/* ---------- Public formatter ---------- */

export function formatHolidayLine(currentDate = new Date()) {
  const fullDate = formatFullDate(currentDate)
  const dayNumber = getHolidayDayNumber(currentDate)

  return `${fullDate} · Day ${dayNumber} of ${HOLIDAY_TOTAL_DAYS}`
}

/* ---------- Render ---------- */

export function renderHolidayDay(currentDate = new Date()) {
  const el = document.getElementById("day")
  if (!el) return

  el.textContent = formatHolidayLine(currentDate)
}


export function buildHolidaySummary({
  date = new Date(),
  locationLabel = ""
  } = {}) {
    const dayNumber = getHolidayDayNumber(date)

    const locationPart = locationLabel
      ? ` · ${locationLabel}`
      : ""

    return `Day ${dayNumber} of ${HOLIDAY_TOTAL_DAYS}${locationPart}`
  }

