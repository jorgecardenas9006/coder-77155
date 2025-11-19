# 🚀 Backend API - Coder House

API REST desarrollada con Node.js, Express, MongoDB, PostgreSQL y Redis para gestión de productos y autenticación de usuarios.

---

## 📋 Tabla de Contenidos

- [Requisitos Previos](#-requisitos-previos)
- [🚀 Inicio Rápido con Docker](#-inicio-rápido-con-docker)
- [⚙️ Configuración](#️-configuración)
- [📡 Endpoints de la API](#-endpoints-de-la-api)
  - [Sesiones](#-sesiones)
  - [Productos](#-productos)
- [⚠️ Notas Importantes](#️-notas-importantes)

---

## 🔧 Requisitos Previos

- [Docker](https://www.docker.com/get-started) y Docker Compose instalados
- Git (opcional, para clonar el repositorio)

---

## 🚀 Inicio Rápido con Docker

### 1. Clonar el repositorio (si aplica)

```bash
git clone <tu-repositorio>
cd coder-77155
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Puerto de la aplicación
PORT=4000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/sessions

# PostgreSQL
POSTGRES_DB=sessions
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=postgresdb

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# JWT Secret
SECRET=tu-secret-key-super-segura

# Email (para recuperación de contraseña)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-app-password

# API Prefix
PREFIX_V1=/api/v1
```

> ⚠️ **Importante**: Para Gmail, necesitas usar una [App Password](https://support.google.com/accounts/answer/185833), no tu contraseña normal.

### 3. Arrancar los servicios con Docker

```bash
# Construir y arrancar todos los servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f app

# Verificar que todos los servicios estén corriendo
docker-compose ps
```

### 4. Verificar que la API esté funcionando

```bash
curl http://localhost:4000/api/v1/products
```

Si todo está correcto, deberías recibir una respuesta JSON con los productos (puede estar vacío si no hay productos).

---

## ⚙️ Configuración

### Servicios incluidos

- **App**: Aplicación Node.js (puerto 4000 por defecto)
- **MongoDB**: Base de datos NoSQL (puerto 27017)
- **PostgreSQL**: Base de datos relacional (puerto 5432)
- **Redis**: Cache y almacenamiento temporal (puerto 6379)

### Comandos útiles de Docker

```bash
# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (⚠️ elimina datos)
docker-compose down -v

# Reiniciar un servicio específico
docker-compose restart app

# Ver logs de un servicio
docker-compose logs -f redis

# Reconstruir la imagen de la app
docker-compose build app
docker-compose up -d app
```

---

## 📡 Endpoints de la API

Base URL: `http://localhost:4000/api/v1`

---

### 🔐 Sesiones

#### 1. Registrar Usuario

Registra un nuevo usuario en el sistema.

**Endpoint:** `POST /sessions/register`

**Autenticación:** No requerida

**Body:**
```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

**Ejemplo con curl:**
```bash
curl -X POST http://localhost:4000/api/v1/sessions/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "password": "password123"
  }'
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "email": "juan@example.com",
      "firstName": "Juan",
      "lastName": "Pérez"
    }
  },
  "message": "Usuario registrado exitosamente"
}
```

---

#### 2. Iniciar Sesión

Autentica un usuario y obtiene un token JWT.

**Endpoint:** `POST /sessions/login`

**Autenticación:** No requerida

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Ejemplo con curl:**
```bash
curl -X POST http://localhost:4000/api/v1/sessions/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "email": "juan@example.com",
      "firstName": "Juan",
      "lastName": "Pérez"
    }
  },
  "message": "Login exitoso"
}
```

---

#### 3. Obtener Usuario Actual

Obtiene la información del usuario autenticado.

**Endpoint:** `GET /sessions/current`

**Autenticación:** ✅ Requerida (JWT)

**Headers:**
```
Authorization: Bearer <tu-token-jwt>
```

**Ejemplo con curl:**
```bash
curl -X GET http://localhost:4000/api/v1/sessions/current \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "juan@example.com",
      "firstName": "Juan",
      "lastName": "Pérez",
      "role": "user"
    }
  },
  "message": "Usuario actual obtenido exitosamente"
}
```

---

#### 4. Solicitar Recuperación de Contraseña

Envía un código de recuperación al email del usuario.

**Endpoint:** `POST /sessions/forgotpassword`

**Autenticación:** No requerida

**Body:**
```json
{
  "email": "juan@example.com"
}
```

**Ejemplo con curl:**
```bash
curl -X POST http://localhost:4000/api/v1/sessions/forgotpassword \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com"
  }'
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Código de recuperación de contraseña enviado exitosamente"
}
```

> 📧 El código se envía por email. El código expira en **5 minutos**.

---

#### 5. Cambiar Contraseña

Cambia la contraseña usando el código de recuperación.

**Endpoint:** `POST /sessions/changepassword/:id`

**Autenticación:** No requerida (usa código de recuperación)

**Parámetros:**
- `id`: Código de recuperación recibido por email

**Body:**
```json
{
  "token": "token-secreto-del-email",
  "newPassword": "nuevaPassword123"
}
```

**Ejemplo con curl:**
```bash
curl -X POST http://localhost:4000/api/v1/sessions/changepassword/123456 \
  -H "Content-Type: application/json" \
  -d '{
    "token": "token-secreto-del-email",
    "newPassword": "nuevaPassword123"
  }'
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Contraseña cambiada exitosamente"
}
```

> ⚠️ **Nota**: El `token` se envía en el email junto con el código. Ambos son necesarios para cambiar la contraseña.

---

### 📦 Productos

#### 1. Obtener Todos los Productos

Lista todos los productos disponibles.

**Endpoint:** `GET /products`

**Autenticación:** No requerida

**Ejemplo con curl:**
```bash
curl -X GET http://localhost:4000/api/v1/products
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Producto 1",
      "price": 99.99,
      "description": "Descripción del producto"
    }
  ],
  "message": "Productos obtenidos exitosamente"
}
```

---

#### 2. Obtener Producto por ID

Obtiene un producto específico por su ID.

**Endpoint:** `GET /products/:id`

**Autenticación:** No requerida

**Ejemplo con curl:**
```bash
curl -X GET http://localhost:4000/api/v1/products/1
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Producto 1",
    "price": 99.99,
    "description": "Descripción del producto"
  },
  "message": "Producto obtenido exitosamente"
}
```

---

#### 3. Crear Producto

Crea un nuevo producto (solo administradores).

**Endpoint:** `POST /products`

**Autenticación:** ✅ Requerida (JWT + Rol Admin)

**Headers:**
```
Authorization: Bearer <tu-token-jwt>
```

**Body:**
```json
{
  "name": "Nuevo Producto",
  "price": 149.99,
  "description": "Descripción del nuevo producto"
}
```

**Ejemplo con curl:**
```bash
curl -X POST http://localhost:4000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "Nuevo Producto",
    "price": 149.99,
    "description": "Descripción del nuevo producto"
  }'
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Nuevo Producto",
    "price": 149.99,
    "description": "Descripción del nuevo producto"
  },
  "message": "Producto creado exitosamente"
}
```

---

#### 4. Actualizar Producto

Actualiza un producto existente (solo administradores).

**Endpoint:** `PUT /products/:id`

**Autenticación:** ✅ Requerida (JWT + Rol Admin)

**Headers:**
```
Authorization: Bearer <tu-token-jwt>
```

**Body:**
```json
{
  "name": "Producto Actualizado",
  "price": 199.99,
  "description": "Nueva descripción"
}
```

**Ejemplo con curl:**
```bash
curl -X PUT http://localhost:4000/api/v1/products/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "Producto Actualizado",
    "price": 199.99,
    "description": "Nueva descripción"
  }'
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Producto Actualizado",
    "price": 199.99,
    "description": "Nueva descripción"
  },
  "message": "Producto actualizado exitosamente"
}
```

---

#### 5. Eliminar Producto

Elimina un producto (solo administradores).

**Endpoint:** `DELETE /products/:id`

**Autenticación:** ✅ Requerida (JWT + Rol Admin)

**Headers:**
```
Authorization: Bearer <tu-token-jwt>
```

**Ejemplo con curl:**
```bash
curl -X DELETE http://localhost:4000/api/v1/products/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Producto eliminado exitosamente"
}
```

---

## ⚠️ Notas Importantes

### 🔒 Autenticación

- Los tokens JWT se envían en el header `Authorization: Bearer <token>`
- Los tokens expiran después de **24 horas**
- El token también se guarda en una cookie llamada `coderCookie` (HttpOnly)

### 📧 Recuperación de Contraseña

- El código de recuperación expira en **5 minutos**
- El código se almacena en Redis con TTL automático
- Necesitas configurar correctamente las credenciales de email en el `.env`
- Para Gmail, usa una **App Password**, no tu contraseña normal

### 👤 Roles de Usuario

- **user**: Usuario normal (por defecto)
- **admin**: Administrador (puede crear/editar/eliminar productos)
- **moderator**: Moderador

### 🗄️ Bases de Datos

- **MongoDB**: Almacena usuarios y sesiones
- **PostgreSQL**: Almacena productos
- **Redis**: Almacena códigos de recuperación de contraseña (TTL: 5 minutos)

### 🐳 Docker

- Los volúmenes de Docker persisten los datos entre reinicios
- Si eliminas los volúmenes (`docker-compose down -v`), perderás todos los datos
- Los puertos están mapeados para acceso local:
  - App: `4000`
  - MongoDB: `27017`
  - PostgreSQL: `5432`
  - Redis: `6379`

### 🔧 Desarrollo

- La aplicación se reinicia automáticamente con `nodemon` en modo desarrollo
- Los logs se pueden ver con `docker-compose logs -f app`
- Para ver logs de todos los servicios: `docker-compose logs -f`

### ⚡ Errores Comunes

1. **Error de conexión a Redis/MongoDB/PostgreSQL**: Verifica que los servicios estén corriendo con `docker-compose ps`
2. **Error de autenticación de email**: Asegúrate de usar una App Password de Gmail
3. **Token inválido**: Verifica que el token no haya expirado (24 horas)
4. **Código de recuperación expirado**: El código solo dura 5 minutos, solicita uno nuevo

---

## 📝 Estructura de Respuestas

Todas las respuestas siguen este formato:

**Éxito:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Mensaje de éxito"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Mensaje de error",
  "message": "Descripción del error"
}
```

---

## 🎯 Próximos Pasos

1. Configura tu archivo `.env` con tus credenciales
2. Arranca los servicios con `docker-compose up -d`
3. Prueba los endpoints con los ejemplos de curl proporcionados
4. ¡Disfruta de la API! 🚀

---

**Desarrollado con ❤️ para Coder House**
