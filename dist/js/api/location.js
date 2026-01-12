export async function getCoords(city) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${city}`
  )
  const data = await res.json()

  if (!data || data.length === 0) {
    throw new Error(`Город "${city}" не найден`)
  }

  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon)
  }
}
