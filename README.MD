
# Nodepop - Plataforma de Venta de Artículos de Segunda Mano

Nodepop es una aplicación para la gestión de productos y usuarios. Esta API permite realizar operaciones CRUD con productos, soporta carga de imágenes, filtros avanzados y consultas por usuario.

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

1. Clona este repositorio.
    ```bash
    git clone <repo-url>
    cd nodepop
    ```
2. Instala las dependencias.
    ```bash
    npm install
    ```
3. Configura las variables de entorno en un archivo `.env` siguiendo el ejemplo:
    ```env
    MONGO_URI='mongodb://127.0.0.1:27017/nodepop'
    SESSION_SECRET=useaStrongPassword 
    JWT_SECRET=generate_your_private_secret
    ```
4. Inicializa la base de datos con datos de ejemplo.
    ```bash
    npm run initDB
    ```
5. Inicia la aplicación en modo desarrollo.
    ```bash
    npm run dev
    ```

## Inicialización de la Base de Datos

Para inicializar la base de datos con datos de ejemplo, ejecuta el script `initDB.js` que eliminará las colecciones existentes y cargará nuevos datos de ejemplo.

```bash
npm run initDB
```

Usuarios de prueba creados por defecto:
- `admin@example.com`
- `user1@example.com`
- `user2@example.com`
- `user3@example.com`

Contraseña para todos: `"1234"`

## Estructura del Proyecto

- `app.js` - Configuración principal de la aplicación y definición de rutas.
- `controllers/` - Controladores para gestionar la lógica de cada funcionalidad.
- `models/` - Modelos de Mongoose para Usuarios, Productos y Tags.
- `lib/` - Funciones auxiliares como la conexión a la base de datos y gestión de sesiones.
- `public/` - Archivos estáticos (CSS e imágenes).
- `views/` - Plantillas EJS para el renderizado de páginas.
- `swaggerConfig.js` - Configuración de Swagger para la documentación de la API.

## Uso

### Paginación y Filtros

La aplicación permite listar productos con opciones de paginación y filtros avanzados. Los productos pueden filtrarse por:

- **Tag**: Categorías como `work`, `lifestyle`, `motor` y `mobile`.
- **Precio**: Rango de precio mínimo y máximo.
- **Nombre**: Productos que comiencen con un nombre específico.

Ejemplo de URL de búsqueda:
```
http://localhost:3000/api/products?tag=mobile&name=ip&price=50-&skip=0&limit=2&sort=price
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

## API Endpoints

### Productos
- **GET /api/products**: Lista de productos con filtros opcionales.
- **POST /api/products**: Crea un nuevo producto.
- **PUT /api/products/:productId**: Actualiza un producto existente.
- **DELETE /api/products/:productId**: Elimina un producto por su ID.

### Usuarios
- **POST /api/users**: Crea un nuevo usuario.
- **PUT /api/users/:userId**: Actualiza un usuario existente.
- **PUT /api/users-change-password/:userId**: Cambia la contraseña de un usuario.

### Swagger

La documentación de la API está disponible en `/api-doc`.

## Tareas en Segundo Plano

Nodepop utiliza RabbitMQ para manejar tareas en segundo plano, como la creación de miniaturas de imágenes.

1. Asegúrate de tener RabbitMQ instalado y en ejecución.
    ```bash
    docker run -d --hostname=mq --name mq -p 8080:15672 -p 5672:5672 rabbitmq:3-management
    ```
2. Configura la conexión a RabbitMQ en el archivo `messageQueue.js`.

## Calidad de Código

Para mantener la calidad del código, se usa ESLint. Puedes ejecutar ESLint en tu proyecto con el siguiente comando:

```bash
npx eslint .
```

Se recomienda solucionar los errores y advertencias que ESLint reporte para mantener la consistencia y calidad del código.

## Licencia

MIT
