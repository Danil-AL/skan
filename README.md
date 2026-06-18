# СКАН

Веб-приложение для поиска и анализа информации о компаниях.

Репозиторий: https://github.com/Danil-AL/skan

## Технологии

- **React 19**
- **Vite**
- **CSS Modules**

## Установка и запуск

```bash
npm install
npm run dev
```

Сборка для production:

```bash
npm run build
npm run preview
```

## Линтинг

```bash
npm run lint
```

## API

Проект использует API `gateway.scan-interfax.ru`. Для dev-режима настроен Vite proxy (`/api` → `gateway.scan-interfax.ru`). Для production запросы идут напрямую к API.

### Тестовые учетные данные

- Логин: `myDiploma`
- Пароль: `willSucceed4Sure`

> Если API недоступен, используется мок-режим с теми же учётными данными.
