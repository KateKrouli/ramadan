const quotes = [
  "الصبر مفتاح الفرج",
  "وَاصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ",
  "إن مع العسر يسرا",
  "رمضان شهر الرحمة والمغفرة"
]

export function pickDailyQuote(dateKey) {
  const hash = [...dateKey].reduce((a, c) => a + c.charCodeAt(0), 0)
  return quotes[hash % quotes.length]
}

export function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)]
}
