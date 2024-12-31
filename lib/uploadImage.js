import multer from 'multer'
import path from 'node:path'
import { __dirname } from '../routes/imageRoutes.js'


const storage = multer.diskStorage({
    destination: function(req, res, callback){
        const pathFile = path.join(__dirname,'..','public', 'uploads')
        callback(null, pathFile)
    },
    filename: function(req, file, callback){
        const filename = `${file.fieldname}-${Date.now()}-${file.originalname}`
        callback(null, filename)
    }
})

const upload = multer({ storage })

export default upload


/*
import cloudinary from './cloudinaryConfig.js';

export async function subirImagen(rutaImagen) {
    try {
        const resultado = await cloudinary.v2.uploader.upload(rutaImagen, {
            folder: "nombre-de-la-carpeta-en-cloudinary" 
        });
        return resultado.secure_url; 
    } catch (error) {
        console.error("Error al subir la imagen:", error);
        throw error;
    }
}
*/