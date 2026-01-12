
## 🚀 Развертывание на сервере

### Требования
- Node.js (версия 14 или выше)
- npm
- Доступ к серверу (Linux, macOS или Windows)

### Структура файлов для развертывания

На сервер нужно скопировать содержимое папки `public/`:

```
deployment/
├── server.js              # Node.js сервер
├── index.html             # Главная страница
├── styles.css             # Скомпилированные стили
├── js/                    # JavaScript файлы
│   ├── lang.js            # Локализация
│   ├── main.js            # Основной скрипт приложения
│   └── swiper-bundle.min.js
├── images/                # Изображения
├── package.json           # Зависимости
└── package-lock.json
```

### Инструкция по размещению

1. **Загрузите файлы на сервер**
   ```bash
   scp -r public/* user@your-server:/path/to/deployment/
   ```

2. **Подключитесь к серверу**
   ```bash
   ssh user@your-server
   cd /path/to/deployment
   ```

3. **Установите зависимости Node.js**
   ```bash
   npm install --production
   ```

4. **Запустите сервер**
   ```bash
   node server.js
   ```

   Для использования другого порта:
   ```bash
   PORT=8080 node server.js
   ```

5. **Проверьте доступ**
   - Откройте браузер: http://localhost:3000
   - Проверьте API: http://localhost:3000/popular/all

### Production Development

**С Nginx reverse proxy:**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**С PM2 для автозапуска:**

```bash
npm install -g pm2
pm2 start server.js --name "goggletrends"
pm2 startup
pm2 save
```

### API Endpoints

- `GET /popular/all` - Популярные запросы по странам
- `GET /news?q=<query>` - Новости по теме

### Переменные окружения

- `NEWS_API_KEY` - API ключ для NewsAPI (рекомендуется). Если не задан, используется встроенный демо-ключ в server.js.
- `PORT` - Порт сервера (3000 по умолчанию)

## 📂 Структура проекта
