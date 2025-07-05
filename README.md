# Backend - Contactos Landing Page

Backend para gestionar solicitudes de contacto.

## 🚀 Características

- **API RESTful** con Express.js
- **Base de datos MongoAtlas** con Mongoose
- **Validación de datos** 
- **Rate limiting** anti-spam
- **Seguridad básica** con Helmet y CORS
- **Prevención de duplicados**
- **Validación de Captcha**
- **JWT**
- **Nodemailer con Gmail**

## 📋 Requisitos

- **Cluster de MongoAtlas**
- **npm**
- **Node.js**

## 🛠️ Instalación

1. **Clona el repositorio**
```bash
git clone URL _del _repo
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Ejecuta el comando
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones

4. **Ejecutar el servidor**
```bash
# Desarrollo (con nodemon)
npm run dev

## 📚 API Endpoints

### 1. Crear Solicitud de Contacto
```http
POST /api/contact
```

**Body:**
```json
{
  "nombreCompleto": "Juan Pérez",
  "correo": "juan@ejemplo.com",
  "telefono": "+52 555 123 4567",
  "mensaje": "Mensaje de contacto"
}
```

### 2. Obtener Contactos (Admin)
```http
GET /api/contacts?page=1&limit=10
```

### 3. Marcar como Leído
```http
PATCH /api/contacts/:id/read
```

## 🔒 Seguridad

- **Rate Limiting**: 5 solicitudes máximo cada 15 minutos
- **CORS**: Configurado para dominios específicos
- **Validación**: Datos sanitizados
- **Duplicados**: 1 solicitud por email cada 24h
