FROM node:20-alpine

WORKDIR /app

# Copiar package.json y package-lock si existe
COPY package*.json ./

# Instalar dependencias (producción)
RUN npm install --production

# Copiar el resto
COPY . .

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
