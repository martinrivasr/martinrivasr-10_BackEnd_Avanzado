import express from 'express'
import path from 'path'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import createError from 'http-errors'
import methodOverride from 'method-override'
import imageRoutes from './routes/imageRoutes.js'
import { connectToRabbitMQ } from './lib/messageQueue.js';

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
import { specs } from './middlewares/swaggerConfig.js';
import swaggermiddleware from './middlewares/swaggermiddleware.js'
import upload from './lib/uploadImage.js'
import i18n from './lib/i18nConfigure.js'
import * as langController from './controllers/langController.js'
import * as apiProductController from './controllers/apicontrollers/apiProductController.js'
import { validateFilters } from './middlewares/filtersMiddleware.js'
import * as apiLoginController from './controllers/apicontrollers/apiLoginController.js'
import * as jwtAuth from './middlewares/jwtAuthMiddleware.js'
import * as apiUserController from './controllers/apicontrollers/apiUserController.js'

await connectMongoose()
await connectToRabbitMQ();

const app = express()

app.use((req, res, next) => {
    console.log('Solicitud entrante:');
    console.log(`Método: ${req.method}`);
    console.log(`URL: ${req.originalUrl}`);
    console.log('Encabezados:', req.headers);
    next();
});

app.locals.appName = 'Nodepop.!!!'

//vistas de ejs
app.set('views','views') // views folder
app.set('view engine', 'ejs')


// Middleware para registrar las solicitudes y los encabezados




app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true })) 
app.use(express.static('public'))
app.use(cookieParser())

app.get('/test-rabbitmq', createItemController.testRabbitMQ);

// API routes


// product routes
app.post('/api/login', apiLoginController.loginJWT)

app.get('/api/products', jwtAuth.authenticateJWT , validateFilters,  apiProductController.productList)
app.get('/api/products/:productId', jwtAuth.authenticateJWT ,  apiProductController.productListbyProductID)
app.get('/api/products/user/:userId', jwtAuth.authenticateJWT ,  apiProductController.productListbyUserID)
app.post('/api/products', jwtAuth.authenticateJWT , upload.single('picture'), apiProductController.productCreation)
app.put('/api/products/:productId', jwtAuth.authenticateJWT , upload.single('picture'), apiProductController.productUpdate)
app.delete('/api/products/:productId', jwtAuth.authenticateJWT ,  apiProductController.productDelete)

// User routes
//app.get('/api/users',  jwtAuth.authenticateJWT, apiUserController.userList)
app.post('/api/users',  jwtAuth.authenticateJWT, apiUserController.userCreation)
app.put('/api/users/:userId', jwtAuth.authenticateJWT, apiUserController.userUpdate)
app.put('/api/users-change-password/:userId', jwtAuth.authenticateJWT, apiUserController.changePassword)

// Website routes

app.use(sessionManager.middleware, sessionManager.useSessionInViews)
app.use(i18n.init)

app.get('/change-locale/:locale', langController.changeLocale)

// Configuración de Swagger como middleware
app.use('/api-doc', swaggermiddleware);
//app.use('/api-doc-swagger-api', swaggerUi.serve, swaggerUi.setup(specs));
                    
// Rutas públicas


app.all('/logout', headerController.logout);
app.get('/', homeController.index);
app.get('/login', loginController.index);
app.post('/login', loginController.postLogin);
app.get('/create-user', userDataController.index);
app.post('/create-user', userDataController.createUser);

// para manejar los datos del usuario
//app.get('/user-data', sessionManager.isLogged,userDataController.index);
app.get('/user-data', sessionManager.isLogged, userDataController.showUserData);
app.post('/user-data-update', sessionManager.isLogged, userDataController.updateUserData);
app.get('/user-chg-pass', sessionManager.isLogged, userDataController.showchgpass);
app.post('/chg-pwd', userDataController.changePassword);


app.get('/create-item', sessionManager.isLogged, createItemController.index);
app.get('/user-items', sessionManager.isLogged, userItemController.index);



app.get('/user-user-chg-pass', sessionManager.isLogged,userDataController.index);

// Rutas privadas (requieren autenticación)

app.post('/create-item', upload.single('picture'), sessionManager.isLogged, createItemController.postNew);

app.get('/product/delete/:productId', sessionManager.isLogged, userItemController.deleteProduct);

// Manejo de errores
app.use((req, res, next) => {
    next(createError(404));
    
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
    //API errors send response with JSON
    if(req.url.startsWith('/api/')){
        res.json({ error:err.message })
        return
    }

    // Configuración de variables locales, solo proporcionando error en desarrollo

    res.locals.message = err.message;
    res.locals.error = process.env.NODEAPP_ENV === 'development' ? err : {};

    res.render('error');
});

export default app;