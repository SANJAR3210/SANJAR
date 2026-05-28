# ПО Движения Первых — ТТИТ

Веб-сайт первичного отделения Движения Первых Томского техникума информационных технологий.

## 🎨 Цветовая схема
- Синий: `#0033A0`
- Красный: `#DA291C`
- Белый: `#FFFFFF`

## 🛠 Технологии
- React 18
- Supabase (PostgreSQL + Realtime)
- XLSX (экспорт в Excel)
- GitHub Pages (деплой)

## 📋 Требования
- Node.js 18+
- npm или yarn
- Аккаунт Supabase (бесплатный)

## 🚀 Быстрый старт

### 1. Клонирование репозитория
```bash
git clone https://github.com/your-username/pdo-tomsk-tti.git
cd pdo-tomsk-tti
```

### 2. Установка зависимостей
```bash
npm install
```

### 3. Настройка Supabase

1. Зарегистрируйтесь на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Откройте SQL Editor → New query
4. Выполните содержимое файла `supabase/migration.sql`
5. Перейдите в Project Settings → API
6. Скопируйте `URL` и `anon public`

### 4. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:
```
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

Или отредактируйте `src/supabase.js` напрямую:
```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

### 5. Настройка CORS в Supabase

В Dashboard перейдите в **Auth → URL Configuration**:
- Site URL: `https://your-username.github.io`
- Redirect URLs: добавьте `https://your-username.github.io/pdo-tomsk-tti`

### 6. Настройка Authentication

В Dashboard перейдите в **Auth → Providers**:
- Включите **Anonymous Sign-ins**
- Это позволит администратору входить без реальной регистрации

### 7. Запуск локально
```bash
npm start
```

### 8. Деплой на GitHub Pages

1. Измените `homepage` в `package.json`:
```json
"homepage": "https://your-username.github.io/pdo-tomsk-tti"
```

2. Настройте репозиторий:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/pdo-tomsk-tti.git
git push -u origin main
```

3. Задеплойте:
```bash
npm run deploy
```

## 🔐 Администратор
- **Логин:** `admin`
- **Пароль:** `admin123`
- Пароль хешируется SHA256 на клиенте

## 📱 Функционал

### Гость
- Просмотр списка участников (ФИО, должность, количество мероприятий)
- Просмотр мероприятий с датами и ссылками ВК
- Общая статистика

### Администратор
- Всё что у гостя +
- Телефон и ссылка ВК участников
- Добавление/редактирование/удаление участников
- Добавление/редактирование/удаление мероприятий
- Привязка участников к мероприятиям
- Добавление ссылок на посты ВК
- Выгрузка данных в Excel (.xlsx)

## 🗄 Структура базы данных

### Таблица `members`
| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | ID участника |
| full_name | TEXT | ФИО |
| position | TEXT | Должность |
| phone | TEXT | Телефон |
| vk_link | TEXT | Ссылка ВК |

### Таблица `events`
| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | ID мероприятия |
| title | TEXT | Название |
| event_date | DATE | Дата |
| vk_post_link | TEXT | Ссылка на пост ВК |

### Таблица `member_events`
| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | ID связи |
| member_id | UUID | ID участника |
| event_id | UUID | ID мероприятия |

## ⚠️ Важно: Бесплатный тариф Supabase

Проект на бесплатном тарифе Supabase:
- 500 МБ базы данных
- 50 000 MAU (Monthly Active Users)
- Неограниченные API-запросы
- **Важно:** проект приостанавливается после 7 дней неактивности. Для продакшена рекомендуется тариф Pro ($25/мес).

## 📄 Лицензия
MIT
