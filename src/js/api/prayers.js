import { DateTime } from "luxon"

/**
 * Возвращает объекты Date для Fajr и Maghrib в правильной часовой зоне города
 */
export async function getPrayerTimes(lat, lon) {
  const res = await fetch(
    `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`
  )
  const data = await res.json()

  if (!data || !data.data) {
    throw new Error("Ошибка получения времени молитв")
  }

  const timings = data.data.timings
  const tz = data.data.meta.timezone
  const date = data.data.date.gregorian.date // формат: "13-01-2026"

  // Конвертация в объект Date с учётом таймзоны
  const fajr = DateTime.fromFormat(`${date} ${timings.Fajr}`, "dd-MM-yyyy HH:mm", { zone: tz }).toJSDate()
  const maghrib = DateTime.fromFormat(`${date} ${timings.Maghrib}`, "dd-MM-yyyy HH:mm", { zone: tz }).toJSDate()

  return { fajr, maghrib }
}
