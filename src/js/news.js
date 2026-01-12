
// Загрузка новостей по Турции в top-news__list
let topNewsSwiper = null;

async function loadTopTurkeyNews() {
  const res = await fetch('/news?q=Turkey');
  const articles = await res.json();
  const container = document.getElementById('top-news-list');
  if (!container) return;
  container.innerHTML = '';
  articles.forEach(article => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `
      <div class="top-news__item">
        <div class="top-news__summary">
          <div class="top-news__country"><img src="images/icon-turkey.webp"> Turkey</div>
          <div class="top-news__date">${article.publishedAt ? new Date(article.publishedAt).toLocaleString() : ''}</div>
        </div>
        <div class="top-news__title"><a href="${article.url}" target="_blank">${article.title}</a></div>
      </div>
    `;
    container.appendChild(slide);
  });
  // Инициализация Swiper после загрузки новостей
  // Удаляем предыдущий Swiper, если был
  if (topNewsSwiper) {
    topNewsSwiper.destroy(true, true);
  }
  topNewsSwiper = new Swiper('.top-news__slider', {
    slidesPerView: 1,
    spaceBetween: 20,
    slidesToScroll: 1,
    loop: true,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
    breakpoints: {
      0: {
        spaceBetween: 6
      },
      768: {
        spaceBetween: 20
      }
    }
  });
}
let lastArticles = []; // Сохраняем последние загруженные статьи

async function loadPopularAll() {
  const res = await fetch('/popular/all');
  const data = await res.json();

  // Кастомные элементы для каждой страны
  const customItems = {
    turkey: {
      text: "Al Ahly",
      url: "https://galatasaray.org/"
    },
    azerbaijan: {
      text: "Al Ahly",
      url: "https://qarabagh.com/"
    },
    lebanon: {
      text: "Al Ahly",
      url: "https://www.lebanon.com/"
    }
  };

  function insertCustomRandomly(arr, customLi) {
    const pos = Math.floor(Math.random() * (arr.length + 1));
    arr.splice(pos, 0, customLi);
    return arr;
  }

  // Turkey
  const turkeyUl = document.querySelector('.top-trends__list:nth-child(1) ul');
  if (turkeyUl) {
    turkeyUl.innerHTML = '';
    const lis = data.turkey.map(q => {
      const li = document.createElement('li');
      li.className = 'top-trends__item';
      li.textContent = q;
      li.addEventListener('click', () => loadNews(q));
      return li;
    });
    const customLi = document.createElement('li');
    customLi.className = 'top-trends__item top-trends__item--custom';
    customLi.innerHTML = `<a href="${customItems.turkey.url}" target="_blank">${customItems.turkey.text}</a>`;
    insertCustomRandomly(lis, customLi).forEach(li => turkeyUl.appendChild(li));
  }

  // Azerbaijan
  const azUl = document.querySelector('.top-trends__list:nth-child(2) ul');
  if (azUl) {
    azUl.innerHTML = '';
    const lis = data.azerbaijan.map(q => {
      const li = document.createElement('li');
      li.className = 'top-trends__item';
      li.textContent = q;
      li.addEventListener('click', () => loadNews(q));
      return li;
    });
    const customLi = document.createElement('li');
    customLi.className = 'top-trends__item top-trends__item--custom';
    customLi.innerHTML = `<a href="${customItems.azerbaijan.url}" target="_blank">${customItems.azerbaijan.text}</a>`;
    insertCustomRandomly(lis, customLi).forEach(li => azUl.appendChild(li));
  }

  // Lebanon
  const lebUl = document.querySelector('.top-trends__list:nth-child(3) ul');
  if (lebUl) {
    lebUl.innerHTML = '';
    const lis = data.lebanon.map(q => {
      const li = document.createElement('li');
      li.className = 'top-trends__item';
      li.textContent = q;
      li.addEventListener('click', () => loadNews(q));
      return li;
    });
    const customLi = document.createElement('li');
    customLi.className = 'top-trends__item top-trends__item--custom';
    customLi.innerHTML = `<a href="${customItems.lebanon.url}" target="_blank">${customItems.lebanon.text}</a>`;
    insertCustomRandomly(lis, customLi).forEach(li => lebUl.appendChild(li));
  }
}

async function loadNews(topic) {
window.loadNews = loadNews;
  const res = await fetch(`/news?q=${encodeURIComponent(topic)}`);
  const articles = await res.json();

  articles.forEach(a => {
    if (typeof a.likes === 'undefined') a.likes = Math.floor(Math.random() * 1000);
    if (typeof a.views === 'undefined') a.views = Math.floor(Math.random() * 5000);
  });

  lastArticles = articles;
  renderNews(articles);
}

function renderNews(articles) {
  const containers = document.querySelectorAll('.news__list');
  containers.forEach(container => {
    container.innerHTML = '';
    if (!articles.length) {
      container.innerHTML = "<p>Новостей не найдено</p>";
      return;
    }
    articles.forEach(article => {
      const item = document.createElement('div');
      // Проверяем, кастомная ли новость (по url или title, можно доработать по необходимости)
      const isCustom = article.title === "Галацасарай выиграл важный матч!" || article.title === "Интервью с тренером Галацасарая";
      item.className = 'news-item' + (isCustom ? ' news-item--custom' : '');
      item.innerHTML = `
        ${article.imageUrl ? `<div class=\"news-item__image\" style=\"background-image:url(${article.imageUrl})\"></div>` : ''}
        <div class=\"news-item__content\">
        <h3><a href=\"${article.url}\" target=\"_blank\">${article.title}</a></h3>
        <p>${article.description || ''}</p>
        <small>${new Date(article.publishedAt).toLocaleString()}</small>
        </div>
        <div class=\"news-item__summary\">👍 Лайки: ${article.likes ?? 0} | 👁️ Просмотры: ${article.views ?? 0}</div>
      `;
      container.appendChild(item);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.search-input').forEach(input => {
    // Ищем ближайшую кнопку внутри той же формы или блока
    let btn = null;
    // Сначала ищем в родителе .search-form, если есть
    const form = input.closest('.search-form');
    if (form) {
      btn = form.querySelector('.search-btn, .search-button');
    }
    // Если не нашли, ищем просто ближайшую кнопку по классу
    if (!btn) {
      btn = input.parentElement.querySelector('.search-btn, .search-button');
    }
    if (btn) {
      btn.addEventListener('click', () => {
        const query = input.value.trim();
        if (query) loadNews(query);
      });
    }
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = input.value.trim();
        if (query) loadNews(query);
      }
    });
  });

  // Поддержка нескольких блоков сортировки
  document.querySelectorAll('.news-index__sort, .sort').forEach(sortBlock => {
    const list = sortBlock.closest('.search-page, .news-index, .news-block, .main-width');
    // Находим соответствующий .news__list рядом с этим блоком
    let newsList = null;
    if (list) {
      newsList = list.querySelector('.news__list');
    }
    // Функция для управления классом active внутри блока
    function setActiveSort(btnId) {
      sortBlock.querySelectorAll('.sort__btn').forEach(btn => {
        btn.classList.remove('active');
      });
      const btn = sortBlock.querySelector(`#${btnId}`);
      if (btn) btn.classList.add('active');
    }
    // Сортировка по умолчанию
    const defaultBtn = sortBlock.querySelector('#sort-default');
    if (defaultBtn) {
      defaultBtn.addEventListener('click', () => {
        if (newsList) renderNews(lastArticles);
        setActiveSort('sort-default');
      });
    }
    // Сортировка по дате
    const dateBtn = sortBlock.querySelector('#sort-date');
    if (dateBtn) {
      dateBtn.addEventListener('click', () => {
        const sorted = [...lastArticles].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        if (newsList) renderNews(sorted);
        setActiveSort('sort-date');
      });
    }
    // Сортировка по лайкам
    const likesBtn = sortBlock.querySelector('#sort-likes');
    if (likesBtn) {
      likesBtn.addEventListener('click', () => {
        const sorted = [...lastArticles].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
        if (newsList) renderNews(sorted);
        setActiveSort('sort-likes');
      });
    }
    // Сортировка по просмотрам (если есть)
    const viewsBtn = sortBlock.querySelector('#sort-views');
    if (viewsBtn) {
      viewsBtn.addEventListener('click', () => {
        const sorted = [...lastArticles].sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
        if (newsList) renderNews(sorted);
        setActiveSort('sort-views');
      });
    }
  });

  loadPopularAll();
  loadNews("Galatasaray");
  loadTopTurkeyNews();

  // Динамическая подстановка выбранного тега в news-index__title h2
  document.querySelectorAll('.top-trends__list ul').forEach(ul => {
    ul.addEventListener('click', function(e) {
      const li = e.target.closest('li');
      if (!li) return;
      const h2 = document.querySelector('.news-index__title h2');
      if (h2 && li.textContent.trim()) {
        h2.textContent = li.textContent.trim();
      } 
    });
  });
});