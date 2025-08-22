# CapVibe

CapVibe es una aplicación de e-commerce full-stack especializada en gorras deportivas, que cuenta con una API RESTful backend construida con Node.js y Express, y un frontend moderno desarrollado en Angular.

## Tabla de Contenidos

- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Documentación de la API](#documentación-de-la-api)
- [Uso](#uso)
- [Autenticación](#autenticación)
- [Esquema de Base de Datos](#esquema-de-base-de-datos)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

## Características

### Backend API
- API RESTful con 8 endpoints principales
- Autenticación y autorización basada en JWT
- Validación de entrada usando express-validator
- Base de datos MongoDB con Mongoose ODM
- Soporte de paginación para conjuntos de datos grandes
- Manejo de errores y logging
- CORS habilitado para peticiones cross-origin
- Arquitectura MVC modular

### Frontend
- Aplicación de página única basada en Angular
- Diseño responsivo con Bootstrap
- Funcionalidad de carrito de compras
- Catálogo de productos con categorías
- Interfaz de autenticación de usuarios
- Sistema de gestión de pedidos

### Funcionalidad Principal
- Registro y autenticación de usuarios
- Gestión de catálogo de productos
- Organización basada en categorías
- Operaciones de carrito de compras
- Procesamiento de pedidos
- Gestión de perfiles de usuario
- Panel de administración para gestión de inventario

## Stack Tecnológico

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Base de Datos**: MongoDB
- **ODM**: Mongoose
- **Autenticación**: JSON Web Tokens (JWT)
- **Validación**: express-validator
- **Hash de Contraseñas**: bcrypt
- **Variables de Entorno**: dotenv

### Frontend
- **Framework**: Angular 19
- **Librería UI**: Bootstrap 5
- **Iconos**: Bootstrap Icons
- **Cliente HTTP**: Angular HttpClient
- **Enrutamiento**: Angular Router
- **Gestión de Estado**: Angular Services

## Estructura del Proyecto

```
CapVibe/
├── ecommerce-api/                 # API Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js        # Conexión a base de datos
│   │   ├── controllers/           # Controladores de rutas
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── userController.js
│   │   │   └── ...
│   │   ├── middlewares/           # Middlewares personalizados
│   │   │   ├── auth.js
│   │   │   └── validators.js
│   │   ├── models/                # Esquemas de MongoDB
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Category.js
│   │   │   └── ...
│   │   └── routes/                # Rutas de la API
│   │       ├── auth.js
│   │       ├── products.js
│   │       └── ...
│   ├── .env.example
│   ├── package.json
│   └── server.js                  # Punto de entrada
└── ecommerce-app/                 # Aplicación Angular Frontend
    ├── src/
    │   ├── app/
    │   │   ├── components/
    │   │   ├── models/
    │   │   ├── pages/
    │   │   └── services/
    │   └── assets/
    └── package.json
```

## Instalación

### Prerrequisitos
- Node.js (v18 o superior)
- MongoDB (v6 o superior)
- Gestor de paquetes npm o yarn

### Configuración del Backend

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/CapVibe.git
cd CapVibe/ecommerce-api
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

4. Configurar tu conexión MongoDB y secreto JWT en `.env`

5. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

La API estará disponible en `http://localhost:3000`

### Configuración del Frontend

1. Navegar al directorio del frontend:
```bash
cd ../ecommerce-app
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

## Configuración

### Variables de Entorno

Crear un archivo `.env` en el directorio `ecommerce-api` con las siguientes variables:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ecommerce-db
JWT_SECRET=tu-clave-secreta-jwt-super-segura
```

### Configuración de Base de Datos

La aplicación creará automáticamente las colecciones necesarias cuando comiences a insertar datos. No se requiere configuración manual de la base de datos.

## Documentación de la API

### URL Base
```
http://localhost:3000/api
```

### Endpoints de Autenticación

#### Registrar Usuario
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Nombre Usuario",
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

#### Iniciar Sesión
```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

### Endpoints de Productos

#### Obtener Todos los Productos
```http
GET /products?page=1&limit=10
```

#### Obtener Producto por ID
```http
GET /products/:id
```

#### Crear Producto (Protegido)
```http
POST /products
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Nombre del Producto",
  "description": "Descripción del producto",
  "price": 999,
  "stock": 50,
  "category": "id_categoria",
  "brand": "Marca",
  "color": "Color",
  "size": "Talla",
  "material": "Material",
  "images": ["url_imagen"]
}
```

### Endpoints de Categorías

#### Obtener Todas las Categorías
```http
GET /categories
```

#### Crear Categoría (Protegido)
```http
POST /categories
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Nombre de Categoría",
  "description": "Descripción de la categoría"
}
```

### Rutas Protegidas

Todos los endpoints marcados como "Protegido" requieren un token JWT válido en el header de autorización:
```
Authorization: Bearer <tu-jwt-token>
```

## Uso

### Ejecutar la Aplicación

1. Iniciar el servicio de MongoDB en tu máquina
2. Iniciar la API backend: `npm run dev` en el directorio `ecommerce-api`
3. Iniciar el frontend: `ng serve` en el directorio `ecommerce-app`
4. Acceder a la aplicación en `http://localhost:4200`

### Datos por Defecto

La aplicación incluye datos de ejemplo para:
- 6 categorías deportivas (MLB, NBA, Liga MX, F1, LMB, NFL)
- Más de 10 productos de gorras deportivas
- Usuario administrador para pruebas

### Roles de Usuario

- **Admin**: Acceso completo a todas las operaciones
- **Cliente**: Usuario regular con capacidades de compra

## Autenticación

La aplicación utiliza JWT (JSON Web Tokens) para autenticación:

1. Los usuarios se registran o inician sesión para recibir un token JWT
2. El token debe incluirse en el header Authorization para rutas protegidas
3. Los tokens expiran después de 7 días
4. Las contraseñas son hasheadas usando bcrypt antes del almacenamiento

## Esquema de Base de Datos

### Modelo de Usuario
- name: String (requerido)
- email: String (requerido, único)
- password: String (requerido, hasheado)
- role: Enum ['admin', 'cliente']
- isActive: Boolean
- timestamps

### Modelo de Producto
- name: String (requerido)
- description: String (requerido)
- price: Number (requerido)
- stock: Number (requerido)
- category: ObjectId (referencia a Category)
- brand: String (requerido)
- color: String (requerido)
- size: String (requerido)
- material: String (requerido)
- images: Array de Strings
- isActive: Boolean
- timestamps

### Modelo de Categoría
- name: String (requerido, único)
- description: String (requerido)
- isActive: Boolean
- timestamps

## Contribuir

1. Fork el repositorio
2. Crear una rama de característica: `git checkout -b nombre-caracteristica`
3. Confirmar tus cambios: `git commit -am 'Agregar alguna característica'`
4. Push a la rama: `git push origin nombre-caracteristica`
5. Enviar un pull request

### Guías de Desarrollo

- Seguir la configuración de ESLint para el estilo de código
- Escribir mensajes de commit descriptivos
- Agregar pruebas para nuevas características
- Actualizar la documentación según sea necesario

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

**CapVibe** - Plataforma de e-commerce para gorras deportivas
Construido con Node.js, Express, MongoDB y Angular