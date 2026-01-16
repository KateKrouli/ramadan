/* core/quotes.js */

import { getHolidayDayNumber } from "./dayCounter.js"

const QUOTES = [
  {
    ar: "الصبر مفتاح الفرج",
    en: "Patience is the key to relief"
  },
  {
    ar: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    en: "Indeed, with hardship comes ease"
  },
  {
    ar: "وَاصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ",
    en: "Be patient, for Allah does not let the reward of the righteous be lost"
  },
  {
    ar: "رمضان شهر الرحمة والمغفرة",
    en: "Ramadan is the month of mercy and forgiveness"
  },
  {
    ar: "قلبٌ متوكلٌ على الله لا يُهزم",
    en: "A heart that trusts Allah is never defeated"
  },
  {
    ar: "كل تأخير من الله هو عطاء",
    en: "Every delay from Allah is a gift"
  },
  {
    ar: "الدعاء يغير القدر",
    en: "Supplication changes destiny"
  },
  {
    ar: "الطمأنينة تأتي من القرب من الله",
    en: "Peace comes from closeness to Allah"
  },
  {
    ar: "ما خاب من استخار",
    en: "Whoever seeks guidance from Allah is never disappointed"
  },
  {
    ar: "الصبر جميل",
    en: "Beautiful patience brings beautiful outcomes"
  },
  {
    ar: "ثق بالله، فالله لا يخذل عبده",
    en: "Trust Allah; He never abandons His servant"
  },
  {
    ar: "الخير فيما اختاره الله",
    en: "Good lies in what Allah chooses"
  },
  {
    ar: "كل شيء بقدر",
    en: "Everything happens by divine decree"
  },
  {
    ar: "الله أقرب مما تظن",
    en: "Allah is closer than you think"
  },
  {
    ar: "القلب الصابر أقوى من كل الظروف",
    en: "A patient heart is stronger than any circumstance"
  },
  {
    ar: "لا تيأس، فإن الله معك",
    en: "Do not despair; Allah is with you"
  },
  {
    ar: "في الصبر أجر بلا حساب",
    en: "In patience lies reward without measure"
  },
  {
    ar: "اطمئن، فالله يدبر الأمر",
    en: "Be at ease; Allah is managing all affairs"
  },
  {
    ar: "الأمل عبادة",
    en: "Hope is an act of worship"
  },
  {
    ar: "ما بعد الصبر إلا الفرج",
    en: "After patience comes relief"
  },
  {
    ar: "ثق أن الله يعلم ما في قلبك",
    en: "Trust that Allah knows what is in your heart"
  },
  {
    ar: "السكينة هدية من الله",
    en: "Tranquility is a gift from Allah"
  },
  {
    ar: "لا شيء مستحيل مع الله",
    en: "Nothing is impossible with Allah"
  },
  {
    ar: "الفرج قريب",
    en: "Relief is near"
  },
  {
    ar: "الرضا باب السعادة",
    en: "Contentment is the door to happiness"
  },
  {
    ar: "الله لا ينسى عباده",
    en: "Allah never forgets His servants"
  },
  {
    ar: "كل دعاء مسموع",
    en: "Every prayer is heard"
  },
  {
    ar: "التوكل راحة",
    en: "Trusting Allah brings peace"
  },
  {
    ar: "من توكل على الله كفاه",
    en: "Whoever relies on Allah, He is sufficient for him"
  },
  {
    ar: "الله أرحم بك من نفسك",
    en: "Allah is more merciful to you than you are to yourself"
  }
]


/**
 * Возвращает цитату дня
 * День 1 → индекс 0
 */
export function pickDailyQuote(currentDate = new Date(), lang = "en") {
  const dayNumber = getHolidayDayNumber(currentDate)
  const index = (dayNumber - 1) % QUOTES.length

  return QUOTES[index][lang]
}

/**
 * Случайная цитата (на будущее)
 */
export function getRandomQuote(lang = "en") {
  const q = QUOTES[Math.floor(Math.random() * QUOTES.length)]
  return q[lang]
}
