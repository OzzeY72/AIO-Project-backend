# 1. Этап сборки (build stage)
FROM node:18-alpine AS builder

# 2. Устанавливаем рабочую директорию для сборки
WORKDIR /app

# 3. Копируем package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# 4. Устанавливаем все зависимости, включая devDependencies для сборки
RUN npm install

# 5. Копируем исходный код в контейнер
COPY . .

# 6. Выполняем сборку проекта (если TypeScript)
RUN npm run build

# 7. Удаляем зависимости разработки для минимизации объема сборки
RUN npm prune

# 8. Этап продакшн (production stage)
FROM node:18-alpine

# 9. Устанавливаем рабочую директорию в финальном контейнере
WORKDIR /app

# 10. Копируем только необходимые файлы из сборочного контейнера
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# 11. Открываем порт для работы приложения
EXPOSE 3001

# 12. Определяем команду для запуска приложения
CMD ["node", "dist/main"]
