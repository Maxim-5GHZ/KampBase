# СтудБаза

> Gamified IT-платформа, где студенты прокачивают реальные навыки кода и зарабатывают звёзды на AI‑помощника.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Java](https://img.shields.io/badge/Java-21-red)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-brightgreen)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)
[![DaisyUI](https://img.shields.io/badge/DaisyUI-4-5a0ef)](https://daisyui.com/)

---

## О проекте

**СтудБаза** — это веб-платформа, которая превращает обучение IT в RPG-приключение.  
Студенты выполняют реальные задачи (Pull Request на GitHub), получают «звёзды опыта», открывают новые ветки дерева навыков и тратят заработанные звёзды на AI‑генерацию отчётов, диаграмм и менторство.

### Ключевые возможности

- 🎮 **Геймификация** – дерево навыков, система уровней.
- 💻 **Реальный код** – задачи проверяются через GitHub Webhooks (автоматическое начисление звёзд).
- 🤖 **AI‑ассистент за звёзды** – генерация отчётов по ГОСТу, диаграмм, помощь в оформлении.
- 📚 **Единая Wiki вуза** – знания, накопленные старшекурсниками, не теряются.
- 🏆 **Leaderboard для HR** – компании получают подтверждённый профиль кандидата (GitHub, звёзды по стекам).

---

## Скриншоты

Интерфейс полностью адаптивен — одинаково удобен на десктопе и мобильных устройствах.

### Десктопная версия (16:9)

| Задачи | Wiki | Профиль |
|--------|------|---------|
| ![Tasks PC](web%20presentation/tasks_pc.png) | ![Wiki PC](web%20presentation/wiki_pc.png) | ![Profile PC](web%20presentation/profile_pc.png) |

| Лидеры | Новая задача | Новая статья |
|--------|--------------|--------------|
| ![Leaders PC](web%20presentation/leaders_pc.png) | ![New Task PC](web%20presentation/new-task_pc.png) | ![New Article PC](web%20presentation/new-article_pc.png) |

### Мобильная версия

| Регистрация | Профиль | Задачи |
|-------------|---------|--------|
| ![Registration Phone](web%20presentation/registration_phone_white.png) | ![Profile Phone](web%20presentation/profile_phone_white.png) | ![Tasks Phone](web%20presentation/tasks_phone.png) |

| Wiki | Лидеры | Новая статья |
|------|--------|--------------|
| ![Wiki Phone](web%20presentation/wiki_phone.png) | ![Leaders Phone](web%20presentation/leaders_phone.png) | ![New Article Phone](web%20presentation/new-article_phone.png) |

| Новая задача |
|--------------|
| ![New Task Phone](web%20presentation/new-task_phone.png) |

---

## Технологический стек

### Backend
- **Java 21** + **Spring Boot 3.2** (монолит, готовый к микросервисам)
- **Axiom JDK** – российский сертифицированный дистрибутив (импортозамещение)
- **MariaDB** – основная база данных
- **Spring Data JPA** – работа с БД
- **GitHub API / Webhooks** – приём PR и начисление звёзд

### Frontend
- **Next.js 14** (React, TypeScript)
- **Tailwind CSS** + **DaisyUI** – стилизация и компоненты
- **Lucide React** – иконки
- **Axios** – HTTP-клиент для связи с бэкендом
- Собственная **TS‑библиотека** для общения с API

### Инфраструктура
- **Docker Compose** – полная контейнеризация
- **Nginx** – reverse proxy (маршрутизация /api → backend)
- **MariaDB** – данные сохраняются в томе `maria_db/data`
- **GitHub Actions** (планируется CI/CD)

---

## Структура проекта

```
.
├── backend/               # Spring Boot приложение
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/
├── backendtest/           # Тесты API (Node.js)
│   ├── api/
│   ├── test-back.ts
│   └── package.json
├── frontend/              # Next.js приложение
│   ├── app/
│   ├── public/
│   ├── dockerfile
│   ├── next.config.ts
│   └── package.json
├── nginx/                 # Конфигурация Nginx
│   ├── nginx.conf
│   └── static/
├── maria_db/              # Персистентные данные MariaDB (игнорируется git)
│   └── data/
├── docker-compose.yml
├── docker-compose.override.yml
├── .env.example           # (создайте .env по образцу)
└── README.md
```

---

## Запуск проекта (локальная разработка)

### 1. Клонируйте репозиторий

```bash
git clone https://github.com/Maxim-5GHZ/KampBase.git
cd KampBase
```

### 2. Настройте переменные окружения

Создайте файл `.env` в корне проекта (можно скопировать из `.env.example`).  
Минимальное содержимое:

```ini
# MariaDB
MARIADB_ROOT_PASSWORD=rootpassword
MARIADB_DATABASE=studbase
MARIADB_USER=studuser
MARIADB_PASSWORD=studpass

# Spring Boot
SPRING_DATASOURCE_URL=jdbc:mariadb://mariadb:3306/studbase
SPRING_DATASOURCE_USERNAME=studuser
SPRING_DATASOURCE_PASSWORD=studpass

# URL API для фронтенда (используется во время сборки)
FRONTEND_API_URL=http://backend:8080
```

### 3. Соберите и запустите контейнеры

```bash
docker compose up --build
```

После успешного запуска:
- Фронтенд: [http://localhost/](http://localhost/)
- Бэкенд API: [http://localhost/api/](http://localhost/api/) (пример)
- База данных: доступна внутри сети на порту 3306

Для остановки:

```bash
docker compose down
```

### 4. Разработка без Docker (опционально)

- **Backend**: запустите `./mvnw spring-boot:run` в папке `backend/`
- **Frontend**: в папке `frontend/` выполните `npm install && npm run dev`
- Убедитесь, что в `.env.local` фронтенда указан `NEXT_PUBLIC_API_URL=http://localhost:8080`

---

## Дорожная карта

- [x] **MVP (хакатон)** – авторизация, Wiki, дерево навыков, GitHub webhook, базовая генерация отчётов.
- [ ] **V2** – P2P‑менторство (студенты покупают консультации за звёзды), расширенная аналитика для HR.
- [ ] **V3** – Интеграция с вузами (LMS, единый вход), корпоративные квесты от IT‑компаний.

---

## Лицензия

Распространяется под лицензией MIT. Подробнее в файле [LICENSE](LICENSE).

---

## Контакты

- Команда разработки: [telegram‑чат](https://t.me/studbase_dev) (по вопросам разработки)
- По вопросам сотрудничества: [team@studbase.ru](mailto:team@studbase.ru)

> *«Хватит зубрить. Пиши код. Развивай комьюнити.»*

---

Теперь в README нет упоминаний Telegram Mini App, акцент на веб-приложение. Сохранены все скриншоты, добавлены бейджи с используемыми технологиями. Описание запуска через Docker Compes полностью соответствует вашей структуре проекта. Если нужно что-то скорректировать — дайте знать.
