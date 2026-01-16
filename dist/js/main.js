(() => {
  // src/js/config/locations.js
  var LOCATIONS = [
    { label: "Mecca, Saudi Arabi", query: "Mecca, Saudi Arabia" },
    { label: "Medina, Saudi Arabia", query: "Medina, Saudi Arabia" },
    { label: "Riyadh, Saudi Arabia", query: "Riyadh, Saudi Arabia" },
    { label: "Jeddah, Saudi Arabia", query: "Jeddah, Saudi Arabia" },
    { label: "Dubai, United Arab Emirates", query: "Dubai, United Arab Emirates" },
    { label: "Abu Dhabi, United Arab Emirates", query: "Abu Dhabi, United Arab Emirates" },
    { label: "Cairo, Egypt", query: "Cairo, Egypt" },
    { label: "Istanbul, Turkey", query: "Istanbul, Turkey" },
    { label: "Ankara, Turkey", query: "Ankara, Turkey" },
    { label: "Doha, Qatar", query: "Doha, Qatar" },
    { label: "Kuwait City, Kuwait", query: "Kuwait City, Kuwait" },
    { label: "Manama, Bahrain", query: "Manama, Bahrain" },
    { label: "Muscat, Oman", query: "Muscat, Oman" },
    { label: "Amman, Jordan", query: "Amman, Jordan" },
    { label: "Jerusalem / Al-Quds", query: "Jerusalem" },
    { label: "Beirut, Lebanon", query: "Beirut, Lebanon" },
    { label: "Casablanca, Morocco", query: "Casablanca, Morocco" },
    { label: "Rabat, Morocco", query: "Rabat, Morocco" },
    { label: "Tunis, Tunisi", query: "Tunis, Tunisia" },
    { label: "Algiers, Algeria", query: "Algiers, Algeria" },
    { label: "Karachi, Pakistan", query: "Karachi, Pakistan" },
    { label: "Lahore, Pakistan", query: "Lahore, Pakistan" },
    { label: "Dhaka, Bangladesh", query: "Dhaka, Bangladesh" },
    { label: "Delhi, India", query: "Delhi, India" },
    { label: "Jakarta, Indonesia", query: "Jakarta, Indonesia" },
    { label: "Kuala Lumpur, Malaysia", query: "Kuala Lumpur, Malaysia" },
    { label: "London, United Kingdom", query: "London, United Kingdom" },
    { label: "Paris, France", query: "Paris, France" },
    { label: "Berlin, Germany", query: "Berlin, Germany" },
    { label: "Amsterdam, Netherlands", query: "Amsterdam, Netherlands" },
    { label: "New York, United States", query: "New York, United States" },
    { label: "Toronto, Canada", query: "Toronto, Canada" },
    { label: "Sydney, Australia", query: "Sydney, Australia" }
  ];

  // src/js/ui/dropdown.js
  function initDropdown(onSelect) {
    const dropdown2 = document.getElementById("locationDropdown");
    const toggle = document.getElementById("dropdownToggle");
    const valueEl = toggle.querySelector(".dropdown__value");
    const menu = document.getElementById("dropdownMenu");
    if (!dropdown2 || !toggle || !menu)
      return;
    LOCATIONS.forEach(({ label, query }) => {
      const item = document.createElement("li");
      item.className = "dropdown__item";
      item.textContent = label;
      item.dataset.query = query;
      item.addEventListener("click", () => {
        valueEl.textContent = label;
        closeDropdown();
        onSelect(query);
      });
      menu.appendChild(item);
    });
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown2.classList.toggle("dropdown--open");
    });
    document.addEventListener("click", () => {
      closeDropdown();
    });
    function closeDropdown() {
      dropdown2.classList.remove("dropdown--open");
    }
    if (LOCATIONS.length) {
      const first = LOCATIONS[0];
      valueEl.textContent = first.label;
      onSelect(first.query);
    }
  }

  // src/js/ui/mode.js
  function setMode(mode) {
    const root = document.getElementById("root");
    root.classList.remove("night", "day");
    root.classList.add(mode === "night" ? "night" : "day");
  }

  // src/js/ui/render.js
  function renderTimer(html) {
    const el = document.getElementById("timer");
    if (!el)
      return;
    el.innerHTML = html;
  }
  function renderQuote(text) {
    const el = document.getElementById("quote");
    if (!el)
      return;
    el.textContent = `\u201C${text}.\u201D`;
  }

  // src/js/api/location.js
  async function getCoords(city) {
    const res = await fetch(
      `/api/geocode?q=${encodeURIComponent(city)}`
    );
    const data = await res.json();
    if (!data || data.length === 0) {
      throw new Error(`\u0413\u043E\u0440\u043E\u0434 "${city}" \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D`);
    }
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon)
    };
  }

  // src/js/api/prayers.js
  async function getPrayerTimes(lat, lon) {
    const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    const res = await fetch(
      `https://api.aladhan.com/v1/timings/${today}?latitude=${lat}&longitude=${lon}&method=2`
    );
    const data = await res.json();
    const timings = data.data.timings;
    return {
      fajr: toDate(timings.Fajr),
      maghrib: toDate(timings.Maghrib)
    };
  }
  function toDate(timeStr) {
    const [h, m] = timeStr.split(":");
    const d = /* @__PURE__ */ new Date();
    d.setHours(+h, +m, 0, 0);
    return d;
  }

  // src/js/core/timer.js
  function startTimer(target, onTick, onEnd) {
    let intervalId = null;
    function tick() {
      const now2 = /* @__PURE__ */ new Date();
      const diff = target - now2;
      if (diff <= 0) {
        clearInterval(intervalId);
        onEnd();
        return;
      }
      const h = Math.floor(diff / 36e5);
      const m = Math.floor(diff % 36e5 / 6e4);
      const s = Math.floor(diff % 6e4 / 1e3);
      const formatted = `${h.toString().padStart(2, "0")}<span>:</span>${m.toString().padStart(2, "0")}<span>:</span>${s.toString().padStart(2, "0")}`;
      onTick(formatted);
    }
    tick();
    intervalId = setInterval(tick, 1e3);
    return intervalId;
  }

  // src/js/core/state.js
  var state = {
    fajr: null,
    maghrib: null,
    mode: null,
    lastFajrDate: null
    // YYYY-MM-DD
  };

  // src/js/core/dayCounter.js
  var HOLIDAY_START_DATE = "2026-03-11";
  var HOLIDAY_TOTAL_DAYS = 30;
  function normalizeDate(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  function getHolidayDayNumber(currentDate = /* @__PURE__ */ new Date()) {
    const start = normalizeDate(HOLIDAY_START_DATE);
    const current = normalizeDate(currentDate);
    const diffDays = Math.floor(
      (current - start) / (1e3 * 60 * 60 * 24)
    );
    const dayNumber = diffDays + 1;
    if (dayNumber < 1)
      return 1;
    if (dayNumber > HOLIDAY_TOTAL_DAYS)
      return HOLIDAY_TOTAL_DAYS;
    return dayNumber;
  }
  function formatFullDate(date) {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric"
    });
  }
  function formatHolidayLine(currentDate = /* @__PURE__ */ new Date()) {
    const fullDate = formatFullDate(currentDate);
    const dayNumber = getHolidayDayNumber(currentDate);
    return `${fullDate} \xB7 Day ${dayNumber} of ${HOLIDAY_TOTAL_DAYS}`;
  }
  function renderHolidayDay(currentDate = /* @__PURE__ */ new Date()) {
    const el = document.getElementById("day");
    if (!el)
      return;
    el.textContent = formatHolidayLine(currentDate);
  }

  // src/js/core/quotes.js
  var QUOTES = [
    {
      ar: "\u0627\u0644\u0635\u0628\u0631 \u0645\u0641\u062A\u0627\u062D \u0627\u0644\u0641\u0631\u062C",
      en: "Patience is the key to relief"
    },
    {
      ar: "\u0625\u0650\u0646\u0651\u064E \u0645\u064E\u0639\u064E \u0627\u0644\u0652\u0639\u064F\u0633\u0652\u0631\u0650 \u064A\u064F\u0633\u0652\u0631\u064B\u0627",
      en: "Indeed, with hardship comes ease"
    },
    {
      ar: "\u0648\u064E\u0627\u0635\u0652\u0628\u0650\u0631\u0652 \u0641\u064E\u0625\u0650\u0646\u0651\u064E \u0627\u0644\u0644\u0651\u064E\u0647\u064E \u0644\u064E\u0627 \u064A\u064F\u0636\u0650\u064A\u0639\u064F \u0623\u064E\u062C\u0652\u0631\u064E \u0627\u0644\u0652\u0645\u064F\u062D\u0652\u0633\u0650\u0646\u0650\u064A\u0646\u064E",
      en: "Be patient, for Allah does not let the reward of the righteous be lost"
    },
    {
      ar: "\u0631\u0645\u0636\u0627\u0646 \u0634\u0647\u0631 \u0627\u0644\u0631\u062D\u0645\u0629 \u0648\u0627\u0644\u0645\u063A\u0641\u0631\u0629",
      en: "Ramadan is the month of mercy and forgiveness"
    },
    {
      ar: "\u0642\u0644\u0628\u064C \u0645\u062A\u0648\u0643\u0644\u064C \u0639\u0644\u0649 \u0627\u0644\u0644\u0647 \u0644\u0627 \u064A\u064F\u0647\u0632\u0645",
      en: "A heart that trusts Allah is never defeated"
    },
    {
      ar: "\u0643\u0644 \u062A\u0623\u062E\u064A\u0631 \u0645\u0646 \u0627\u0644\u0644\u0647 \u0647\u0648 \u0639\u0637\u0627\u0621",
      en: "Every delay from Allah is a gift"
    },
    {
      ar: "\u0627\u0644\u062F\u0639\u0627\u0621 \u064A\u063A\u064A\u0631 \u0627\u0644\u0642\u062F\u0631",
      en: "Supplication changes destiny"
    },
    {
      ar: "\u0627\u0644\u0637\u0645\u0623\u0646\u064A\u0646\u0629 \u062A\u0623\u062A\u064A \u0645\u0646 \u0627\u0644\u0642\u0631\u0628 \u0645\u0646 \u0627\u0644\u0644\u0647",
      en: "Peace comes from closeness to Allah"
    },
    {
      ar: "\u0645\u0627 \u062E\u0627\u0628 \u0645\u0646 \u0627\u0633\u062A\u062E\u0627\u0631",
      en: "Whoever seeks guidance from Allah is never disappointed"
    },
    {
      ar: "\u0627\u0644\u0635\u0628\u0631 \u062C\u0645\u064A\u0644",
      en: "Beautiful patience brings beautiful outcomes"
    },
    {
      ar: "\u062B\u0642 \u0628\u0627\u0644\u0644\u0647\u060C \u0641\u0627\u0644\u0644\u0647 \u0644\u0627 \u064A\u062E\u0630\u0644 \u0639\u0628\u062F\u0647",
      en: "Trust Allah; He never abandons His servant"
    },
    {
      ar: "\u0627\u0644\u062E\u064A\u0631 \u0641\u064A\u0645\u0627 \u0627\u062E\u062A\u0627\u0631\u0647 \u0627\u0644\u0644\u0647",
      en: "Good lies in what Allah chooses"
    },
    {
      ar: "\u0643\u0644 \u0634\u064A\u0621 \u0628\u0642\u062F\u0631",
      en: "Everything happens by divine decree"
    },
    {
      ar: "\u0627\u0644\u0644\u0647 \u0623\u0642\u0631\u0628 \u0645\u0645\u0627 \u062A\u0638\u0646",
      en: "Allah is closer than you think"
    },
    {
      ar: "\u0627\u0644\u0642\u0644\u0628 \u0627\u0644\u0635\u0627\u0628\u0631 \u0623\u0642\u0648\u0649 \u0645\u0646 \u0643\u0644 \u0627\u0644\u0638\u0631\u0648\u0641",
      en: "A patient heart is stronger than any circumstance"
    },
    {
      ar: "\u0644\u0627 \u062A\u064A\u0623\u0633\u060C \u0641\u0625\u0646 \u0627\u0644\u0644\u0647 \u0645\u0639\u0643",
      en: "Do not despair; Allah is with you"
    },
    {
      ar: "\u0641\u064A \u0627\u0644\u0635\u0628\u0631 \u0623\u062C\u0631 \u0628\u0644\u0627 \u062D\u0633\u0627\u0628",
      en: "In patience lies reward without measure"
    },
    {
      ar: "\u0627\u0637\u0645\u0626\u0646\u060C \u0641\u0627\u0644\u0644\u0647 \u064A\u062F\u0628\u0631 \u0627\u0644\u0623\u0645\u0631",
      en: "Be at ease; Allah is managing all affairs"
    },
    {
      ar: "\u0627\u0644\u0623\u0645\u0644 \u0639\u0628\u0627\u062F\u0629",
      en: "Hope is an act of worship"
    },
    {
      ar: "\u0645\u0627 \u0628\u0639\u062F \u0627\u0644\u0635\u0628\u0631 \u0625\u0644\u0627 \u0627\u0644\u0641\u0631\u062C",
      en: "After patience comes relief"
    },
    {
      ar: "\u062B\u0642 \u0623\u0646 \u0627\u0644\u0644\u0647 \u064A\u0639\u0644\u0645 \u0645\u0627 \u0641\u064A \u0642\u0644\u0628\u0643",
      en: "Trust that Allah knows what is in your heart"
    },
    {
      ar: "\u0627\u0644\u0633\u0643\u064A\u0646\u0629 \u0647\u062F\u064A\u0629 \u0645\u0646 \u0627\u0644\u0644\u0647",
      en: "Tranquility is a gift from Allah"
    },
    {
      ar: "\u0644\u0627 \u0634\u064A\u0621 \u0645\u0633\u062A\u062D\u064A\u0644 \u0645\u0639 \u0627\u0644\u0644\u0647",
      en: "Nothing is impossible with Allah"
    },
    {
      ar: "\u0627\u0644\u0641\u0631\u062C \u0642\u0631\u064A\u0628",
      en: "Relief is near"
    },
    {
      ar: "\u0627\u0644\u0631\u0636\u0627 \u0628\u0627\u0628 \u0627\u0644\u0633\u0639\u0627\u062F\u0629",
      en: "Contentment is the door to happiness"
    },
    {
      ar: "\u0627\u0644\u0644\u0647 \u0644\u0627 \u064A\u0646\u0633\u0649 \u0639\u0628\u0627\u062F\u0647",
      en: "Allah never forgets His servants"
    },
    {
      ar: "\u0643\u0644 \u062F\u0639\u0627\u0621 \u0645\u0633\u0645\u0648\u0639",
      en: "Every prayer is heard"
    },
    {
      ar: "\u0627\u0644\u062A\u0648\u0643\u0644 \u0631\u0627\u062D\u0629",
      en: "Trusting Allah brings peace"
    },
    {
      ar: "\u0645\u0646 \u062A\u0648\u0643\u0644 \u0639\u0644\u0649 \u0627\u0644\u0644\u0647 \u0643\u0641\u0627\u0647",
      en: "Whoever relies on Allah, He is sufficient for him"
    },
    {
      ar: "\u0627\u0644\u0644\u0647 \u0623\u0631\u062D\u0645 \u0628\u0643 \u0645\u0646 \u0646\u0641\u0633\u0643",
      en: "Allah is more merciful to you than you are to yourself"
    }
  ];
  function pickDailyQuote(currentDate = /* @__PURE__ */ new Date(), lang = "en") {
    const dayNumber = getHolidayDayNumber(currentDate);
    const index = (dayNumber - 1) % QUOTES.length;
    return QUOTES[index][lang];
  }

  // src/js/main.js
  var title = `<h1 class="app__title" data-i18="app.title">Fasting Time</h1>`;
  var timer = `<div class="timer__container">
  <div id="timer" class="timer">00:00:00</div>
</div>`;
  var dropdown = `
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
</div>`;
  var quoteTpl = `<div id="quote" class="app__quote"></div>`;
  var dayTpl = `<div id="day" class="app__date"></div>`;
  var appElement = document.getElementById("app");
  if (appElement) {
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
  `;
  }
  var timerId = null;
  async function loadCity(city) {
    try {
      const { lat, lon } = await getCoords(city);
      const { fajr, maghrib } = await getPrayerTimes(lat, lon);
      const now2 = /* @__PURE__ */ new Date();
      const isNightNow = now2 > maghrib || now2 < fajr;
      setMode(isNightNow ? "night" : "day");
      const target = isNightNow ? fajr : maghrib;
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
      if (!state.lastFajrDate) {
        state.lastFajrDate = now2.toISOString().slice(0, 10);
      }
      renderQuote(pickDailyQuote(state.lastFajrDate));
      renderHolidayDay(now2);
      timerId = startTimer(target, renderTimer, () => {
        const now3 = /* @__PURE__ */ new Date();
        const isNight = now3 > maghrib || now3 < fajr;
        if (!isNight) {
          const today = now3.toISOString().slice(0, 10);
          state.lastFajrDate = today;
          renderQuote(pickDailyQuote(today));
          renderHolidayDay(now3);
        }
        setMode(isNight ? "night" : "day");
        loadCity(city);
      });
    } catch (err) {
      console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0435 \u0433\u043E\u0440\u043E\u0434\u0430:", err);
      renderQuote(`\u041E\u0448\u0438\u0431\u043A\u0430: \u0433\u043E\u0440\u043E\u0434 "${city}" \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D`);
      renderTimer("00:00:00");
    }
  }
  var now = /* @__PURE__ */ new Date();
  var fajrTime = /* @__PURE__ */ new Date();
  fajrTime.setHours(5, 30, 0);
  var maghribTime = /* @__PURE__ */ new Date();
  maghribTime.setHours(17, 30, 0);
  var isNightOnLoad = now > maghribTime || now < fajrTime;
  setMode(isNightOnLoad ? "night" : "day");
  renderHolidayDay(now);
  initDropdown(loadCity);
})();
