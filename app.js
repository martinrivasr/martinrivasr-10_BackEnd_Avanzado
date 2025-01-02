import express from 'express'
import path from 'path'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
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
import { specs } from './middlewares/swaggerConfig.js';
import swaggermiddleware from './middlewares/swaggermiddleware.js'

import upload from './lib/uploadImage.js'
import i18n from './lib/i18nConfigure.js'
import * as langController from './controllers/langController.js'

import * as apiProductController from './controllers/apicontrollers/apiProductController.js'
import { validateFilters } from './middlewares/filtersMiddleware.js'


await connectMongoose()

const app = express()

app.locals.appName = 'Nodepop.!!!'

//vistas de ejs
app.set('views','views') // views folder
app.set('view engine', 'ejs')


app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true })) 
app.use(express.static('public'))
app.use(cookieParser())

// API routes

app.get('/api/products', validateFilters,  apiProductController.productList)
app.get('/api/products/:productId',  apiProductController.productListbyProductID)
app.get('/api/products/user/:userId',  apiProductController.productListbyUserID)
app.post('/api/products', upload.single('picture'), apiProductController.productCreation)
app.put('/api/products/:productId', upload.single('picture'), apiProductController.productUpdate)
app.delete('/api/products/:productId',  apiProductController.productDelete)

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
app.get('/create-user', createUserController.index);
app.post('/create-user', sessionManager.isLogged, createUserController.registerUser);
app.get('/create-item', sessionManager.isLogged, createItemController.index);
app.get('/user-items', sessionManager.isLogged, userItemController.index);


app.get('/user-data', sessionManager.isLogged,userDataController.index);

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