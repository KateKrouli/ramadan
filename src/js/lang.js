// src/js/lang.js

const translations = {
  en: {
    sort: {
      'sort-defaul': 'Rising',
      'sort-likes': 'Hot',
      'sort-date': 'New'
    },
    search: {
      title: "Trending",
      placeholderMain: "Search trends and news...",
      placeholder: "Search...",
      trending: "Dashboard",
      btn: "Search", 
      close: "Cancel"
    },
    header: {
      menuHome: "Telegram",
      menuAbout: "News",
      menuContact: "About"
    },
    trends: {
      title: "Top trends across MENA",
      description: "Real-time tracking of the hottest sports topics across "
    },
    news: {
      title: "Sports news",
      viewAll: "View all posts"
    },
    footer: {
      copyright: "All rights reserved."
    },
   main: {
        title: "Go OG — Follow the Trends",
        description: "A community-driven platform discovering and tracking sports content across MENA.",
        button: "Search Trends & News",
      },
    telegram: {
      title: "Stay Connected — <span>Join Our Telegram</span>",
      description: "Get the hottest sports stories, trend alerts, and exclusive insights directly in our Telegram channel. Don’t miss out on updates and surprises!",
      button: "Join Telegram"
    }
  }, 
  tr: {
    sort: {
      'sort-defaul': 'Yükselen',
      'sort-likes': 'Popüler',
      'sort-date': 'Yeni'
    },
    search: {
      title: "Trendler",
      placeholderMain: "Trendleri ve haberleri ara...",
      placeholder: "Ara...",
      trending: "Panel",
      btn: "Ara", 
      close: "İptal"
    },
    header: {
      menuHome: "Telegram",
      menuAbout: "Hakkımızda",
      menuContact: "İletişim"
    },
    trends: {
      title: "En Popüler Trendler",
      description: "Dünya genelinde en popüler spor konularının gerçek zamanlı takibi"
    },
    news: {
      title: "Spor haberleri",
      viewAll: "Tüm gönderileri görüntüle"
    },
    footer: {
      copyright: "Tüm hakları saklıdır." 
    },
    main: {
        title: "Go OG — Trendleri Takip Et",
        description: "MENA genelinde spor içeriklerini keşfeden ve takip eden topluluk odaklı bir platform.",
        button: "Trendleri ve Haberleri Ara",
      },
    telegram: {
      title: "Bağlantıda Kalın — <span>Telegram'a Katılın</span>",
      description: "En sıcak spor hikayeleri, trend uyarıları ve özel analizler doğrudan Telegram kanalımızda. Sürprizleri ve güncellemeleri kaçırmayın!",
      button: "Telegram'a Katıl"
    }
  }
};



function setLanguage(lang) {
  localStorage.setItem('lang', lang);
  applyTranslations(lang);
  setDirection(lang);
}


function setDirection(lang) {
  document.documentElement.dir = 'ltr';
  document.body.style.textAlign = '';
}


function getLanguage() {
  return localStorage.getItem('lang') || 'en';
}

function applyTranslations(lang) {
  const t = translations[lang];
  if (!t) return;
  // Search
  if (t.search) {
    document.querySelectorAll('[data-i18n="search.title"]').forEach(el => el.textContent = t.search.title);
    document.querySelectorAll('[data-i18n-placeholder="search.placeholder"]').forEach(el => el.placeholder = t.search.placeholder);
    document.querySelectorAll('[data-i18n-placeholder="search.placeholderMain"]').forEach(el => el.placeholder = t.search.placeholderMain);
    document.querySelectorAll('[data-i18n="search.trending"]').forEach(el => el.textContent = t.search.trending);
    document.querySelectorAll('[data-i18n="search.btn"]').forEach(el => el.textContent = t.search.btn);
    document.querySelectorAll('[data-i18n="search.close"]').forEach(el => el.textContent = t.search.close);
  }
  // Sort
  if (t.sort) {
    document.querySelectorAll('[data-i18n="sort.sort-defaul"]').forEach(el => el.textContent = t.sort['sort-defaul']);
    document.querySelectorAll('[data-i18n="sort.sort-likes"]').forEach(el => el.textContent = t.sort['sort-likes']);
    document.querySelectorAll('[data-i18n="sort.sort-date"]').forEach(el => el.textContent = t.sort['sort-date']);
  }
 
  // Header
  document.querySelectorAll('[data-i18n="header.title"]').forEach(el => el.textContent = t.header.title);
  document.querySelectorAll('[data-i18n="header.menuHome"]').forEach(el => el.textContent = t.header.menuHome);
  document.querySelectorAll('[data-i18n="header.menuAbout"]').forEach(el => el.textContent = t.header.menuAbout);
  document.querySelectorAll('[data-i18n="header.menuContact"]').forEach(el => el.textContent = t.header.menuContact);

  document.querySelectorAll('[data-i18n="trends.title"]').forEach(el => el.textContent = t.trends.title);
  document.querySelectorAll('[data-i18n="trends.description"]').forEach(el => el.textContent = t.trends.description); 
  // Footer
  document.querySelectorAll('[data-i18n="footer.copyright"]').forEach(el => el.textContent = t.footer.copyright);
  // Mains
  document.querySelectorAll('[data-i18n="main.title"]').forEach(el => {
    if (typeof t.main.title === 'object' && t.main.title.html) {
      el.innerHTML = t.main.title.html;
    } else {
      el.textContent = t.main.title;
    }
  });
  document.querySelectorAll('[data-i18n="main.description"]').forEach(el => el.textContent = t.main.description);
  document.querySelectorAll('[data-i18n="main.button"]').forEach(el => el.textContent = t.main.button);
  document.querySelectorAll('[data-i18n-placeholder="main.button"]').forEach(el => el.placeholder = t.main.button);
  // News
  document.querySelectorAll('[data-i18n="news.title"]').forEach(el => el.textContent = t.news.title);
  document.querySelectorAll('[data-i18n="news.viewAll"]').forEach(el => el.textContent = t.news.viewAll);
  // Telegram
  document.querySelectorAll('[data-i18n="telegram.title"]').forEach(el => el.innerHTML = t.telegram.title);
  document.querySelectorAll('[data-i18n="telegram.description"]').forEach(el => el.textContent = t.telegram.description);
  document.querySelectorAll('[data-i18n="telegram.button"]').forEach(el => el.textContent = t.telegram.button);
} 


document.addEventListener('DOMContentLoaded', function() {
  const lang = getLanguage();
  applyTranslations(lang);
  setDirection(lang);
});

// Экспортируем функцию для глобального доступа (кастомный дропдаун)
window.setLanguage = setLanguage;
