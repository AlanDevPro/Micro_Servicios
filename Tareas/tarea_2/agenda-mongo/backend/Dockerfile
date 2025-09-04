FROM node:20-alpine

WORKDIR /app

# Copiar package*.json e instalar
COPY package*.json ./
RUN npm install 

# Copiar app
COPY . .

# Variables (puedes usar ENV o .env)
ENV PORT=3001
EXPOSE 3001

# Ajusta el comando de inicio si tu app usa `npm start` o archivo distinto
CMD ["node", "index.js"]
