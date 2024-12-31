import express from 'express'
import logger from 'morgan'
import createError from 'http-errors'
import imageRoutes from './routes/imageRoutes.js'
import * as homeController  from './controllers/homecontroller.js'
import * as headerController from './controllers/headerController.js'
import * as loginController from './controllers/loginControllers.js'
import * as createItemController from './controllers/createItemController.js'
import * as createUserController from './controllers/createUserController.js'   
import * as userItemController from './controllers/userItemsController.js'
import * as userDataController from './controllers/userDataController.js'
import connectMongoose from './lib/DBConection.js';
import * as sessionManager from './lib/sessionManager.js'
import swaggerUi from 'swagger-ui-express';
import { specs } from './swaggerConfig.js';



await connectMongoose()

const app = express()

app.locals.appName = 'Nodepop.!!!'

//vistas de ejs
app.set('views','views') // views folder
app.set('view engine', 'ejs')




//app.use(logger('dev'))
//app.use(logger('dev'))
app.use(sessionManager.middleware, sessionManager.useSessionInViews)

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded())
app.use('/', express.static('public'))
app.all('/logout', headerController.logout)


// Configuración de Swagger como middleware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Rutas públicas

/**
 * @swagger
 * /logout:
 *   all:
 *     summary: Cerrar sesión
 *     description: Cierra la sesión del usuario.
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente.
 */
app.all('/logout', headerController.logout);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Página de inicio
 *     description: Muestra la página principal con los productos.
 *     responses:
 *       200:
 *         description: Página principal cargada correctamente.
 */
app.get('/', homeController.index);

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Formulario de inicio de sesión
 *     description: Muestra el formulario para iniciar sesión.
 *     responses:
 *       200:
 *         description: Formulario de login mostrado correctamente.
 */
app.get('/login', loginController.index);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Autentica al usuario y crea una sesión.
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso.
 *       401:
 *         description: Credenciales inválidas.
 */
app.post('/login', loginController.postLogin);

/**
 * @swagger
 * /create-user:
 *   get:
 *     summary: Formulario de registro
 *     description: Muestra el formulario para crear un nuevo usuario.
 *     responses:
 *       200:
 *         description: Formulario de registro mostrado correctamente.
 */
app.get('/create-user', createUserController.index);

/**
 * @swagger
 * /create-user:
 *   post:
 *     summary: Registro de usuario
 *     description: Crea un nuevo usuario en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario creado exitosamente.
 *       400:
 *         description: Error en los datos proporcionados.
 */
app.post('/create-user', createUserController.registerUser);

/**
 * @swagger
 * /create-item:
 *   get:
 *     summary: Formulario de creación de producto
 *     description: Muestra el formulario para crear un nuevo producto.
 *     responses:
 *       200:
 *         description: Formulario de creación de producto mostrado correctamente.
 */
app.get('/create-item', createItemController.index);

/**
 * @swagger
 * /user-items:
 *   get:
 *     summary: Productos del usuario
 *     description: Muestra los productos pertenecientes al usuario logueado.
 *     responses:
 *       200:
 *         description: Lista de productos del usuario mostrada correctamente.
 *       401:
 *         description: No autorizado.
 */
app.get('/user-items', userItemController.index);

/**
 * @swagger
 * /user-data:
 *   get:
 *     summary: Datos del usuario
 *     description: Muestra los datos del usuario logueado.
 *     responses:
 *       200:
 *         description: Datos del usuario mostrados correctamente.
 *       401:
 *         description: No autorizado.
 */
app.get('/user-data', userDataController.index);

// Rutas privadas (requieren autenticación)

/**
 * @swagger
 * /create-item:
 *   post:
 *     summary: Crear un nuevo producto
 *     description: Crea un nuevo producto en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *               precio:
 *                 type: number
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Producto creado exitosamente.
 *       400:
 *         description: Error en los datos proporcionados.
 *       401:
 *         description: No autorizado.
 */
app.post('/create-item', sessionManager.isLogged, createItemController.postNew);

/**
 * @swagger
 * /product/delete/{productId}:
 *   get:
 *     summary: Eliminar producto
 *     description: Elimina un producto del usuario logueado.
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a eliminar
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Producto no encontrado.
 */
app.get('/product/delete/:productId', sessionManager.isLogged, userItemController.deleteProduct);

// Manejo de errores
app.use((req, res, next) => {
    next(createError(404));
    res.render('error');
});

app.use((err, req, res, next) => {
    // Error de validación
    if (err.array) {
        err.message = 'Invalid request: ' + err.array()
            .map(e => `${e.location} ${e.type} ${e.path} ${e.msg}`)
            .join();
        err.status = 422;
    }
    res.status(err.status || 500);
    // Configuración de variables locales, solo proporcionando error en desarrollo
    res.locals.message = err.message;
    res.locals.error = process.env.NODEAPP_ENV === 'development' ? err : {};

    res.render('error');
});

export default app;