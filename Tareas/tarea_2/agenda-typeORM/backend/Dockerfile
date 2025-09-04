FROM node:20-alpine

WORKDIR /app

# Copiar package*.json e instalar
COPY package*.json ./
RUN npm install 

# Copiar app
COPY . .

# Variables (puedes usar ENV o .env)
ENV PORT=3002
EXPOSE 3002

# Ajusta el comando de inicio si tu app usa `npm start` o archivo distinto
CMD ["node", "index.js"]
