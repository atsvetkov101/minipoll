# Мини-анкета (minipoll)

Тестовое full-stack приложение для ДЗ №1: анкета из 4 вопросов.

- **Backend**: NestJS (`server/`) — `GET /questions`, `POST /answers`, хранение в памяти
- **Frontend**: React + Vite (`client/`) — форма анкеты, экран «Спасибо!»

## Запуск

Требуется Node.js 18+. Команды выполняются из корня репозитория.

```cmd
npm install
npm run dev:server
npm run dev:client
```

- Backend: http://localhost:3001
- Frontend: http://localhost:5173

Скрипты для проверки: `npm run build`, `npm run lint`, `npm run typecheck`, `npm test`.
