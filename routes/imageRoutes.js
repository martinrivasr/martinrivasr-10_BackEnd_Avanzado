import express from 'express';
import { upload } from '../controllers/imageController.js';

const router = express.Router();

router.post('/upload', upload.single('imagen'), (req, res) => {
    
    res.send('Imagen recibida');
});

export default router;
