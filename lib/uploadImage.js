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
