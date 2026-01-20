import { translations } from "./translations.js"

export const i18n = {
  currentLang: localStorage.getItem("language") || "en",

  init() {
    this.currentLang = localStorage.getItem("language") || "en"
    this.updatePageLanguage()
  },

  setLanguage(lang) {
    if (lang === "en" || lang === "ar") {
      this.currentLang = lang
      localStorage.setItem("language", lang)
      this.updatePageLanguage()
      this.updateDOM()
    }
  },

  getLanguage() {
    return this.currentLang
  },

  t(key) {
    const keys = key.split(".")
    let value = translations[this.currentLang]

    for (const k of keys) {
      value = value?.[k]
    }

    return value || key
  },

  updatePageLanguage() {
    const htmlElement = document.documentElement
    htmlElement.lang = this.currentLang
    htmlElement.dir = this.currentLang === "ar" ? "rtl" : "ltr"
  },

  updateDOM() {
    document.querySelectorAll("[data-i18]").forEach((el) => {
      const key = el.getAttribute("data-i18")
      const text = this.t(key)
      el.textContent = text
    })
  }
}
