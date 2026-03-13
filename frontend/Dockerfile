# Dockerfile для Next.js (заглушка)
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Создаем пустую папку .next
RUN mkdir .next

# Создаем заглушку для страницы index.js
RUN mkdir pages && echo 'export default function Home() { return <h1>Frontend (placeholder)</h1>; }' > pages/index.js

EXPOSE 3000

CMD ["npm", "run", "dev"]
