FROM node:20-alpine

WORKDIR /app

# copiar package.json y package-lock si existe
COPY package*.json ./

# instalar dependencias (modo producción)
RUN npm install --production

# copiar resto del proyecto
COPY . .

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
