export async function getCoords(city) {
  const res = await fetch(
    `/api/geocode?q=${encodeURIComponent(city)}`
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
