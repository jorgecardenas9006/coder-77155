# 🚀 Coder-77155 - Backend API

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-22-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-5.1.0-black?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0.2-green?style=for-the-badge&logo=mongodb)
![Docker](https://img.shields.io/badge/Docker-Compose-blue?style=for-the-badge&logo=docker)

**Una API REST moderna construida con Node.js, Express y MongoDB**

[📋 Características](#-características) • [🚀 Instalación](#-instalación) • [🐳 Docker](#-docker) • [📚 API](#-api) • [🏗️ Arquitectura](#️-arquitectura)

</div>

---

## 📋 Características

- ✅ **API REST** completa con Express.js
- 🗄️ **Base de datos MongoDB** con Mongoose ODM
- 🐳 **Containerización** con Docker y Docker Compose
- 📝 **Validación de datos** robusta con Mongoose schemas
- 🔐 **Sistema de autenticación** con sesiones
- 🍪 **Manejo de cookies** y sesiones seguras
- 🔄 **ES Modules** (import/export)
- 🚀 **Desarrollo** con Nodemon para hot reload
- 📊 **Modelo de Usuario** completo con validaciones
- 🌐 **Variables de entorno** para configuración

## 🚀 Instalación

### Prerrequisitos

- [Node.js](https://nodejs.org/) (versión 22 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (local o Atlas)

### Instalación Local

1. **Clona el repositorio**
   ```bash
   git clone git@github.com:jorgecardenas9006/coder-77155.git
   cd coder-77155
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Edita el archivo `.env` con tus configuraciones:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/coder-77155
   ```

4. **Inicia MongoDB** (si usas instalación local)
   ```bash
   # macOS con Homebrew
   brew services start mongodb-community
   
   # Ubuntu/Debian
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```

5. **Ejecuta la aplicación**
   ```bash
   # Modo desarrollo (con hot reload)
   npm run dev
   
   # Modo producción
   npm start
   ```

## 🐳 Docker

### Despliegue con Docker Compose (Recomendado)

Esta es la forma más fácil de ejecutar toda la aplicación:

1. **Clona y navega al proyecto**
   ```bash
   git clone git@github.com-personal:jorgecardenas9006/coder-77155.git
   cd coder-77155
   ```

2. **Crea el archivo de variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Configura las variables en `.env`:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://mongodb:27017/coder-77155
   ```

3. **Ejecuta con Docker Compose**
   ```bash
   # Construir y ejecutar todos los servicios
   docker-compose up --build
   
   # Ejecutar en segundo plano
   docker-compose up -d --build
   ```

4. **Verifica que todo funcione**
   ```bash
   # Ver logs de los servicios
   docker-compose logs -f
   
   # Verificar estado de los contenedores
   docker-compose ps
   ```

### Comandos Docker útiles

```bash
# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (⚠️ elimina datos de MongoDB)
docker-compose down -v

# Reconstruir solo la aplicación
docker-compose up --build app

# Ejecutar comandos dentro del contenedor
docker-compose exec app npm run dev

# Ver logs de un servicio específico
docker-compose logs -f app
docker-compose logs -f mongodb
```

### Despliegue Individual con Docker

Si prefieres ejecutar solo la aplicación con Docker:

```bash
# Construir la imagen
docker build -t coder-77155 .

# Ejecutar el contenedor
docker run -p 3000:3000 --env-file .env coder-77155
```

## 📚 API

### Endpoints Disponibles

#### 👥 Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/users` | Obtener todos los usuarios |
| `POST` | `/api/users` | Crear un nuevo usuario |

#### 🔐 Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/login` | Iniciar sesión |
| `GET` | `/me` | Obtener usuario autenticado |
| `POST` | `/logout` | Cerrar sesión |

### Ejemplos de Uso

#### Crear un usuario
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan.perez@example.com",
    "password": "miPassword123",
    "phone": "+5491123456789",
    "role": "user",
    "dateOfBirth": "1990-05-15",
    "address": "Av. Corrientes 1234",
    "city": "Buenos Aires"
  }'
```

#### Obtener todos los usuarios
```bash
curl http://localhost:3000/api/users
```

#### Iniciar sesión
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan.perez@example.com",
    "password": "miPassword123"
  }'
```

#### Obtener usuario autenticado
```bash
curl http://localhost:3000/me \
  -H "Cookie: connect.sid=tu-session-id"
```

#### Cerrar sesión
```bash
curl -X POST http://localhost:3000/logout \
  -H "Cookie: connect.sid=tu-session-id"
```

### Modelo de Usuario

El modelo de usuario incluye los siguientes campos:

```javascript
{
  // Información personal
  firstName: String (requerido, 2-50 caracteres),
  lastName: String (requerido, 2-50 caracteres),
  email: String (requerido, único, formato email),
  phone: String (opcional, formato internacional),
  password: String (requerido, mínimo 8 caracteres),
  
  // Estado y roles
  role: String (enum: 'user', 'admin', 'moderator', default: 'user'),
  isActive: Boolean (default: true),
  isEmailVerified: Boolean (default: false),
  
  // Perfil
  avatar: String (opcional),
  dateOfBirth: Date (opcional, debe ser anterior a hoy),
  address: String (opcional, máximo 200 caracteres),
  city: String (opcional, máximo 50 caracteres),
  
  // Configuraciones
  preferences: {
    language: String (enum: 'es', 'en', 'pt', default: 'es'),
    timezone: String (default: 'America/Argentina/Buenos_Aires'),
    notifications: {
      email: Boolean (default: true),
      push: Boolean (default: true),
      sms: Boolean (default: false)
    }
  },
  
  // Timestamps automáticos
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date (opcional)
}
```

### Campos Virtuales

- **`fullName`**: Combina firstName y lastName
- **`age`**: Calcula la edad basada en dateOfBirth

## 🏗️ Arquitectura

```
src/
├── app.js                 # Punto de entrada de la aplicación
├── models/
│   └── user.model.js      # Modelo de Usuario con Mongoose
└── routes/
    └── users.router.js     # Rutas para usuarios
```

### Estructura del Proyecto

- **`app.js`**: Configuración principal de Express, middleware y conexión a MongoDB
- **`models/user.model.js`**: Schema de Mongoose con validaciones completas
- **`routes/users.router.js`**: Controladores para operaciones CRUD de usuarios
- **`Dockerfile`**: Configuración para containerización
- **`docker-compose.yml`**: Orquestación de servicios (app + MongoDB)

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Puerto del servidor
PORT=3000

# URI de conexión a MongoDB
MONGODB_URI=mongodb://localhost:27017/coder-77155

# Para Docker Compose usar:
# MONGODB_URI=mongodb://mongodb:27017/coder-77155

# Configuración de sesiones
SESSION_SECRET=tu-clave-secreta-super-segura-aqui
```

### Scripts Disponibles

```bash
npm run dev    # Ejecuta con Nodemon (desarrollo)
npm start      # Ejecuta en modo producción
```

## 🚀 Despliegue en Producción

### Con Docker Compose

1. **Configura las variables de entorno de producción**
   ```env
   PORT=3000
   MONGODB_URI=mongodb://tu-servidor-mongodb:27017/coder-77155-prod
   ```

2. **Ejecuta en producción**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Con Docker Swarm o Kubernetes

El proyecto está preparado para escalabilidad horizontal. Considera:

- Usar un MongoDB cluster para alta disponibilidad
- Implementar load balancers
- Configurar health checks
- Usar secrets para variables sensibles

## 🛠️ Desarrollo

### Mejores Prácticas Implementadas

- ✅ **Validación de datos** con Mongoose schemas
- ✅ **Manejo de errores** centralizado
- ✅ **Variables de entorno** para configuración
- ✅ **Containerización** con Docker
- ✅ **ES Modules** para modularidad
- ✅ **Documentación** JSDoc en modelos
- ✅ **Campos virtuales** para datos calculados
- ✅ **Timestamps automáticos** con Mongoose

### Próximas Mejoras Sugeridas

- [ ] Implementar autenticación JWT
- [ ] Agregar middleware de logging
- [ ] Implementar rate limiting
- [ ] Agregar tests unitarios e integración
- [ ] Configurar CI/CD pipeline
- [ ] Implementar paginación en endpoints
- [ ] Agregar documentación con Swagger/OpenAPI

## 📝 Licencia

Este proyecto está bajo la Licencia ISC.

## 👨‍💻 Autor

Desarrollado como parte del curso Backend II de Coder House.

---

<div align="center">

**¿Te gusta este proyecto? ¡Dale una ⭐!**

[🐛 Reportar Bug](https://github.com/jorgecardenas9006/coder-77155/issues) • [💡 Solicitar Feature](https://github.com/jorgecardenas9006/coder-77155/issues)

</div>