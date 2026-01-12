
document.addEventListener('DOMContentLoaded', function() {
  const mobileBtn = document.querySelector('.header__mobile-btn');
  const nav = document.querySelector('.header__nav');
  const header = document.querySelector('header');
  const openBtns = document.querySelectorAll('.search-btn');
  if (mobileBtn && nav && header) {
    mobileBtn.addEventListener('click', function() {
      mobileBtn.classList.toggle('close');
      nav.classList.toggle('open');
      header.classList.toggle('nav-open');
    });
  }

  openBtns.forEach(btn => {
			btn.addEventListener('click', (e) => {
				 mobileBtn.classList.remove('close');
				nav.classList.remove('open');
				header.classList.remove('nav-open');
			});
		});  
});

// Открытие/закрытие попапа поиска
document.addEventListener('DOMContentLoaded', () => {
	// Возврат в изначальное состояние по клику на логотип
	const logo = document.querySelector('.header__logo');
	logo?.addEventListener('click', (e) => {
		e.preventDefault();
		document.querySelector('.main-block')?.classList.remove('hidden');
		document.querySelector('.top-trends')?.classList.remove('hidden');
		document.querySelector('.telegram')?.classList.remove('hidden');
		document.querySelector('.search-page')?.classList.add('hidden');
		document.querySelector('.index-page')?.classList.remove('hidden');
		// Сбросить заголовок новостей
		const newsH2 = document.querySelector('.news__h2');
		if (newsH2) newsH2.textContent = 'Sports news';
	});
	// Обновление заголовка новостей при поиске из main-block__input
	const mainInput = document.querySelector('.main-block__input');
	const newsH2 = document.querySelector('.news__h2');
	if (mainInput && newsH2) {
			mainInput.addEventListener('keydown', (e) => {
				if (e.key === 'Enter') {
					const query = mainInput.value.trim();
					if (query) {
						newsH2.textContent = query;
						document.querySelector('.main-block')?.classList.add('hidden');
						document.querySelector('.top-trends')?.classList.add('hidden');
						document.querySelector('.telegram')?.classList.add('hidden');
					}
				}
			});
	}

	// Обновление заголовка новостей при выборе тренда из top-trends__list
	document.querySelectorAll('.top-trends__list ul').forEach(ul => {
			ul.addEventListener('click', function(e) {
				const li = e.target.closest('li');
				if (!li) return;
				if (newsH2 && li.textContent.trim()) {
					newsH2.textContent = li.textContent.trim();
					document.querySelector('.main-block')?.classList.add('hidden');
					document.querySelector('.top-trends')?.classList.add('hidden');
					document.querySelector('.telegram')?.classList.add('hidden');
				}
			});
	});
	document.querySelectorAll('.search-popup').forEach(popup => {
		const openBtns = document.querySelectorAll('.search-btn');
		const closeBtns = popup.querySelectorAll('.search-popup__close');
		const container = popup.querySelector('.search-popup__container');
		openBtns.forEach(btn => {
			btn.addEventListener('click', (e) => {
				e.preventDefault();
				popup.classList.add('open');
			});
		}); 
		closeBtns.forEach(btn => {
			btn.addEventListener('click', (e) => {
				e.preventDefault();
				popup.classList.remove('open');
			});
		});
		if (container) {
			popup.addEventListener('click', (e) => {
				if (!container.contains(e.target)) {
					popup.classList.remove('open');
            }
			});
		}
	});
});

document.addEventListener('DOMContentLoaded', () => {
    const allNewsBtn =  document.querySelector('.all-news-btn');
    const newsList = document.querySelector('.news__list--index');
    allNewsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (newsList) {
            newsList.querySelectorAll('.news-item').forEach((item, index) => {
                if (index >= 16) {
                    item.style.display = 'flex';
                }
            });
            allNewsBtn.style.display = 'none';
        }
    });
});
import './lang.js';
import './news.js';


// // Динамически подгружать блок статей для выбранного языка через fetch
// async function showArticlesByLang(lang) {
//   const main = document.querySelector('main');
//   if (!main) return;
//   // Удаляем все существующие блоки статей
//   main.querySelectorAll('[data-lang]').forEach(div => div.remove());
//   // Создаём новый блок и подгружаем содержимое
//   const div = document.createElement('div');
//   div.setAttribute('data-lang', lang);
//   let file = '';
//   if (lang === 'ru') file = 'components/articles-ru.html';
//   if (lang === 'en') file = 'components/articles-en.html';
//   if (lang === 'ar') file = 'components/articles-ar.html';
//   if (file) {
//     try {
//       const resp = await fetch(file);
//       if (resp.ok) {
//         div.innerHTML = await resp.text(); 
//       } else {
//         div.innerHTML = '<p>Не удалось загрузить статьи</p>';
//       }
//     } catch {
//       div.innerHTML = '<p>Ошибка загрузки статей</p>';
//     }
//     // Вставляем после заголовка
//     const h1 = main.querySelector('h1[data-i18n="main.greeting"]');
//     if (h1 && h1.nextSibling) {
//       main.insertBefore(div, h1.nextSibling);
//     } else {
//       main.appendChild(div);
//     }
//   }
// }

// // Инициализация показа статей по языку
// document.addEventListener('DOMContentLoaded', function() {
//   const lang = localStorage.getItem('lang') || 'ru';
//   showArticlesByLang(lang);
//   // Следим за сменой языка
//   const langSelect = document.getElementById('lang-select');
//   if (langSelect) {
//     langSelect.addEventListener('change', e => {
//       showArticlesByLang(e.target.value);
//     });
//   }
//   // На случай смены языка не через select
//   window.showArticlesByLang = showArticlesByLang;
// });

// // Переопределяем setLanguage, если он есть
// if (typeof setLanguage === 'function') {
//   const origSetLanguage = setLanguage;
//   window.setLanguage = function(lang) {
//     origSetLanguage(lang);
//     showArticlesByLang(lang);
//   };
// }

// // Счетчик с рандомным числом
// function startRandomCounter() {
//   const el = document.getElementById('random-counter');
//   if (!el) return;
//   function update() {
//     el.textContent = Math.floor(Math.random() * (1600 - 1200 + 1)) + 1200;
//   }
//   update();
//   setInterval(update, 5000);
// }

// document.addEventListener('DOMContentLoaded', startRandomCounter);

// Вывод 3 случайных трендов в попап поиска
async function showRandomTrendsInPopup() {
	try {
		const res = await fetch('/popular/all');
		const data = await res.json();
		// Собираем все тренды в один массив
		const allTrends = [...(data.turkey || []), ...(data.azerbaijan || []), ...(data.lebanon || [])];
		// Выбираем 3 случайных
		const randomTrends = [];
		const used = new Set();
		while (randomTrends.length < 3 && allTrends.length) {
			const idx = Math.floor(Math.random() * allTrends.length);
			if (!used.has(allTrends[idx])) {
				randomTrends.push(allTrends[idx]);
				used.add(allTrends[idx]);
			}
		}
		const ul = document.querySelector('#search-requests ul');
		if (ul) {
			ul.innerHTML = '';
			randomTrends.forEach(trend => {
				const li = document.createElement('li');
				const span = document.createElement('span');
				span.textContent = trend;
				li.appendChild(span);
				ul.appendChild(li);
			});
		}
	} catch (e) {
		// Ошибка запроса
	}
}

	// Показывать тренды при открытии попапа
	document.addEventListener('DOMContentLoaded', () => {
		const popup = document.querySelector('.search-popup');
		const indexPage = document.querySelector('.index-page');
		const searchPage = document.querySelector('.search-page');
		const newsH2 = document.querySelector('.news__h2');
		if (popup) {
			showRandomTrendsInPopup();
			// Добавляем обработчик клика на li тренда
			const ul = popup.querySelector('#search-requests ul');
			const input = popup.querySelector('#search-popup-input');
			const btn = popup.querySelector('.search-popup__btn');
			function updateBtnState() {
				if (btn && input) {
					btn.disabled = !input.value.trim();
				}
			}
			if (ul) {
				ul.addEventListener('click', function(e) {
					const li = e.target.closest('li');
					if (li && input) {
						input.value = li.textContent.trim();
						updateBtnState();
						if (newsH2) newsH2.textContent = li.textContent.trim();
					}
				});
			}
			if (input) {
				input.addEventListener('input', updateBtnState);
				// Инициализация состояния кнопки при загрузке
				updateBtnState();
				function handleSearchPopup() {
					const query = input.value.trim();
					if (query) {
						loadNews(query);
						popup.classList.remove('open');
						if (indexPage) {
							indexPage.classList.add('hidden');
						}
						if (searchPage) {
							searchPage.classList.remove('hidden');
						}
						if (newsH2) newsH2.textContent = query;
						document.querySelector('.main-block')?.classList.add('hidden');
						document.querySelector('.top-trends')?.classList.add('hidden');
						document.querySelector('.telegram')?.classList.add('hidden');
					}
				}
				btn.addEventListener('click', handleSearchPopup);
				input.addEventListener('keydown', (e) => {
					if (e.key === 'Enter') {
						handleSearchPopup();
					}
				});
			}
		}
	});