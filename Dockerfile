# ============================================
# Stage 1: Builder - Instalar dependencias
# ============================================
FROM node:22-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de producción y desarrollo
# Usar npm ci para instalaciones más rápidas y reproducibles
RUN npm ci --include=dev

# Copiar el código fuente
COPY . .

# ============================================
# Stage 2: Production - Imagen final optimizada
# ============================================
FROM node:22-alpine AS production

# Crear usuario no-root para mayor seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production && \
    npm cache clean --force

# Copiar código fuente desde el builder
COPY --from=builder /app/src ./src

# Cambiar ownership al usuario nodejs
RUN chown -R nodejs:nodejs /app

# Cambiar al usuario no-root
USER nodejs

# Exponer el puerto (se puede sobrescribir con variable de entorno)
EXPOSE 3000

# Comando por defecto (puede ser sobrescrito en docker-compose)
CMD ["node", "src/app.js"]

# ============================================
# Stage 3: Development - Para desarrollo con hot reload
# ============================================
FROM node:22-alpine AS development

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar todas las dependencias (incluyendo dev)
RUN npm ci

# Copiar el código fuente
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando para desarrollo con watch mode
CMD ["npm", "run", "dev"]
