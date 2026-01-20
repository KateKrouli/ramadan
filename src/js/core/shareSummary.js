import {
  getHolidayDayNumber,
  HOLIDAY_TOTAL_DAYS
} from "./dayCounter.js"

export function buildShareSummary({ date = new Date(), locationLabel }) {
  const day = getHolidayDayNumber(date)

  return `Day ${day} of Ramadan · ${locationLabel}`
}
