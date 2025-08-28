FROM node:20-alpine

# Crear directorio de trabajo
WORKDIR /app

# Instalar solo dependencias
COPY package*.json ./
RUN npm ci --omit=dev

# Copiar el resto del código
COPY . .

# Exponer el puerto 8080
EXPOSE 8080

# Comando de inicio
CMD ["npm", "start"]
