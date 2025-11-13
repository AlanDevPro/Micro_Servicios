FROM node:18-alpine

WORKDIR /usr/src/app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3002

# Usuario no root
USER node

# Comando de inicio
CMD ["node", "server.js"]