
# Nodepop - Plataforma de Venta de Artículos de Segunda Mano

Nodepop es una aplicación web desarrollada para la venta de artículos de segunda mano, donde los usuarios pueden publicar, buscar y gestionar productos mediante una interfaz amigable y funcionalidades avanzadas de filtrado y paginación.

## Índice

- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Inicialización de la Base de Datos](#inicialización-de-la-base-de-datos)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Uso](#uso)
  - [Paginación y Filtros](#paginación-y-filtros)
  - [Registro y Autenticación](#registro-y-autenticación)
  - [Gestión de Productos](#gestión-de-productos)
- [Documentación de la API](#documentación-de-la-api)
- [Calidad de Código](#calidad-de-código)

## Tecnologías

- Node.js
- Express
- MongoDB con Mongoose
- EJS para el renderizado en servidor
- Swagger para la documentación de la API
- ESLint para la calidad del código

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tuusuario/nodepop.git
   cd nodepop
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

# nvm use 18.20.4
# npm install cross-env 
# npm install -g nodemon
# npm install chance
# npm install cloudinary
# npm install express
# npm install debug
# npm install http-errors
# npm install multer
# npm install morgan
# npm install ejs
# npm install express-validator
# npm install mongoose 
# npm install bcrypt
# npm install express-session
# npm install connect-mongo
# npm install basic-auth 
# npm install express-session 


Crea un archivo `.env` en la raíz del proyecto con la configuración para MongoDB y otras variables necesarias, como `PORT` y `CLOUDINARY_URL` ( se deja la condiguracion para utilizar  Cloudinary para el manejo de imágenes una vez que se despliegue el proyecto).

## .env

en la primer llamada del programa, se debe de confirar el archivo .env.example con las variables de entorno requeridas.

```js
copy .env.example .env
```
## Inicialización de la Base de Datos

Para inicializar la base de datos con datos de ejemplo, ejecuta el script `initDB.js` que eliminará las colecciones existentes y cargará nuevos datos de ejemplo.

```bash
npm run initDB
```

Este script crea usuarios y productos de ejemplo para probar la funcionalidad de la aplicación. hay cuatro usuarios estandar para probar la aplicacion:

admin@example.com
user1@example.com
user2@example.com
user3@example.com

el password por defecto para todos los usuarios es :"password123"

## Estructura del Proyecto

- `app.js` - Configuración principal de la aplicación y definición de rutas.
- `controllers/` - Controladores para gestionar la lógica de cada funcionalidad.
- `models/` - Modelos de Mongoose para Usuarios, Productos y Tags.
- `lib/` - Funciones auxiliares como la conexión a la base de datos y gestión de sesiones.
- `public/` - Archivos estáticos (CSS e imágenes).
- `views/` - Plantillas EJS para el renderizado de páginas.
- `swaggerConfig.js` - Configuración de Swagger para la documentación de la API.

## API
base URL: http://localhost:3000/api

### product List
Get /api/products

```json
        {
            "_id": "6730e5270cc9c61c0e48937b",
            "product": "Auriculares",
            "precio": 117,
            "picture": "https://example.com/producto0-1.jpg",
            "tags": [
                {
                    "_id": "6730e5260cc9c61c0e489368",
                    "tagname": "mobile",
                    "__v": 0,
                    "createdAt": "2024-11-10T16:53:58.983Z",
                    "updatedAt": "2024-11-10T16:53:58.983Z"
                }
            ],
            "owner": {
                "_id": "6730e5270cc9c61c0e48936a",
                "email": "liiwci@pugre.er",
                "name": "Ann Reeves",
                "password": "$2b$10$6fhjTDJYtmDHJDfmJbl0oOQxY5GNVgiP2.PLvXdsBJsKoihnKWLuS",
                "country": "New Caledonia",
                "__v": 0,
                "createdAt": "2024-11-10T16:53:59.216Z",
                "updatedAt": "2024-11-10T16:53:59.216Z"
            },
            "__v": 0,
            "createdAt": "2024-11-10T16:53:59.505Z",
            "updatedAt": "2024-11-10T16:53:59.505Z"
        }
```
### Create list
Get /api/products

```json
{
    "result": {
        "product": "monitor",
        "precio": 9999,
        "picture": "picture-1735783499930-monitor.jpg",
        "tags": [
            "6730e5260cc9c61c0e489367",
            "6730e5260cc9c61c0e489365"
        ],
        "owner": "6730e5270cc9c61c0e489375",
        "_id": "6775f44bfb5a62e345ed45df",
        "createdAt": "2025-01-02T02:05:00.044Z",
        "updatedAt": "2025-01-02T02:05:00.044Z",
        "__v": 0
    }
}
```

## productlist by product ID
Get api/products/:productId

## productlist by User ID
Get api/products/user/:userId

## Uso

### Paginación y Filtros

La aplicación permite listar productos con opciones de paginación y filtros avanzados. Los productos pueden filtrarse por:

- **Tag**: Categorías como `work`, `lifestyle`, `motor` y `mobile`.
- **Precio**: Rango de precio mínimo y máximo.
- **Nombre**: Productos que comiencen con un nombre específico.

Ejemplo de URL de búsqueda:
```
http://localhost:3000/?tag=mobile&name=ip&price=50-&skip=0&limit=2&sort=price
```

### Registro y Autenticación

Los usuarios pueden registrarse, iniciar sesión y acceder a funcionalidades privadas, como la gestión de sus propios productos. Al iniciar sesión, se muestra un menú de usuario con opciones como "Mi cuenta", "Mis productos" y "Logout".

### Gestión de Productos

Cada usuario puede crear, ver y eliminar sus propios productos. Solo pueden gestionarse los productos propios del usuario logueado. Los productos contienen la siguiente información:

- Nombre
- Propietario
- Precio
- Foto
- Tags (uno o varios)

## Documentación de la API

Swagger se ha configurado para documentar la API de manera interactiva. Puedes acceder a la documentación en:

```
http://localhost:3000/api-docs
```

Esta documentación incluye todos los endpoints de la aplicación, como:

- **GET /** - Página de inicio con lista de productos.
- **GET /login** - Formulario de inicio de sesión.
- **POST /login** - Inicio de sesión.
- **GET /create-user** - Formulario de registro de usuario.
- **POST /create-user** - Registro de usuario.
- **GET /create-item** - Formulario para crear un producto.
- **POST /create-item** - Creación de un nuevo producto.
- **GET /user-items** - Listado de productos del usuario logueado.
- **GET /user-data** - Datos del usuario logueado.

## Calidad de Código

Para mantener la calidad del código, se usa ESLint. Puedes ejecutar ESLint en tu proyecto con el siguiente comando:

```bash
npx eslint .
```

Se recomienda solucionar los errores y advertencias que ESLint reporte para mantener la consistencia y calidad del código.

## Notas adicionales

- La aplicación utiliza autenticación basada en sesiones.
- Cada usuario solo puede ver o gestionar sus propios productos.
- Para la subida de imágenes se recomienda utilizar Cloudinary (configurar `CLOUDINARY_URL` en `.env`).


