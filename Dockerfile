# Используем официальный образ Node.js
FROM node:20-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы проекта
COPY . .

# Строим приложение
RUN npm run build

# Открываем порт 3000 для приложения
EXPOSE 3000

# Запуск приложения
CMD ["npm", "run", "start:prod"]
