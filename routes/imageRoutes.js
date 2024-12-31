import express from 'express';
import { upload } from '../controllers/imageController.js';

const router = express.Router();

router.post('/upload', upload.single('imagen'), (req, res) => {
    
    res.send('Imagen recibida');
});

export default router;


// para cComonJS para referencia la carpata actual
//__dirname

//en ESM (Mascript modele) en Node 20.11 o superior se utiliza
//import.meta.dirname

//import.meta.dirname existe desde Node 20.11
//
//import {dirname } from 'node:path'
//import { fileURLToPath } from 'node:url'
//export const __filename = fileURLToPath(import.meta.url)
//export const __dirname = import.meta.dirname

export const __dirname = import.meta.dirname